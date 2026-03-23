import React, { useRef, useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  Animated,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import * as Location from "expo-location";
import MapView, { Marker, Polyline, Circle, Region } from "react-native-maps";
import { fetchDirections, RouteCoordinate, TransportMode } from "../../core/utils/directions";
import { clusterLocations, Cluster } from "../../core/utils/clustering";
import { observer } from "mobx-react";
import ServiceLocator from "../../di/ServiceLocator";
import { LocationStore } from "../../presentation/stores/LocationStore";
import { ReviewStore } from "../../presentation/stores/ReviewStore";
import { LocationMarker } from "../components/LocationMarker";
import { ClusterMarker } from "../components/ClusterMarker";
import { LocationDetail } from "../components/LocationDetail";
import { CategoryFilter } from "../components/CategoryFilter";
import { SearchBar } from "../components/SearchBar";
import { ReviewModal } from "../components/ReviewModal";
import { RootStackParamList } from "../navigation/RootNavigator";

const DEFAULT_REGION: Region = {
  latitude: -8.6705,
  longitude: 115.2126,
  latitudeDelta: 0.1,
  longitudeDelta: 0.1,
};

const MapScreen: React.FC = observer(() => {
  const locationStore: LocationStore = ServiceLocator.getLocationStore();
  const reviewStore: ReviewStore = ServiceLocator.getReviewStore();
  const authStore = ServiceLocator.getAuthStore();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const mapRef = useRef<MapView>(null);
  const locationSubscription = useRef<Location.LocationSubscription | null>(
    null,
  );

  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [routeCoords, setRouteCoords] = useState<RouteCoordinate[]>([]);
  const [routeColor, setRouteColor] = useState("#6b7280");
  const [routeLoading, setRouteLoading] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [transportMode, setTransportMode] = useState<TransportMode>("driving");
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [latDelta, setLatDelta] = useState(DEFAULT_REGION.latitudeDelta);
  const aiPulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(aiPulse, {
          toValue: 1.2,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(aiPulse, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, []);

  const currentRegion = useRef<Region>(DEFAULT_REGION);

  const handleZoom = (direction: "in" | "out") => {
    const factor = direction === "in" ? 0.5 : 2;
    const next: Region = {
      ...currentRegion.current,
      latitudeDelta: currentRegion.current.latitudeDelta * factor,
      longitudeDelta: currentRegion.current.longitudeDelta * factor,
    };
    mapRef.current?.animateToRegion(next, 300);
    currentRegion.current = next;
  };

  useFocusEffect(
    React.useCallback(() => {
      initializeApp();
      return () => {
        locationSubscription.current?.remove();
        locationSubscription.current = null;
      };
    }, []),
  );

  const initializeApp = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      console.log("[MapScreen] Location permission status:", status);

      if (status !== "granted") {
        console.log(
          "[MapScreen] Permission denied, fetching data without location",
        );
        await locationStore.fetchCategories();
        await locationStore.fetchLocations(100);
        console.log("[MapScreen] categories:", locationStore.categories.length);
        console.log("[MapScreen] locations:", locationStore.locations.length);
        return;
      }

      // Get initial position
      const initial = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      const { latitude, longitude } = initial.coords;
      console.log("[MapScreen] User location:", { latitude, longitude });

      setUserLocation({ latitude, longitude });
      mapRef.current?.animateToRegion(
        { latitude, longitude, latitudeDelta: 0.05, longitudeDelta: 0.05 },
        500,
      );

      await locationStore.fetchCategories();
      console.log(
        "[MapScreen] categories loaded:",
        locationStore.categories.length,
        locationStore.categories,
      );
      console.log("[MapScreen] categories error:", locationStore.error);

      await locationStore.fetchLocations(100);
      console.log(
        "[MapScreen] locations loaded:",
        locationStore.locations.length,
      );
      console.log("[MapScreen] locations error:", locationStore.error);
      console.log(
        "[MapScreen] sample location:",
        JSON.stringify(locationStore.locations[0]),
      );

      // Watch position for real-time updates
      locationSubscription.current = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.Balanced,
          distanceInterval: 10,
        },
        (loc) => {
          setUserLocation({
            latitude: loc.coords.latitude,
            longitude: loc.coords.longitude,
          });
        },
      );
    } catch (error) {
      console.error("[MapScreen] Error initializing app:", error);
      await locationStore.fetchCategories();
      await locationStore.fetchLocations(100);
    }
  };

  const handleRoutePress = async (mode: TransportMode) => {
    if (!userLocation || !locationStore.selectedLocation) return;
    setRouteLoading(true);
    try {
      const categoryName =
        locationStore.selectedLocation.category?.name?.toLowerCase() ?? "";
      const colors: Record<string, string> = {
        wisata: "#22c55e",
        health: "#ef4444",
        hotel: "#3b82f6",
      };
      setRouteColor(colors[categoryName] ?? "#6b7280");
      const coords = await fetchDirections(
        userLocation,
        {
          latitude: locationStore.selectedLocation.latitude,
          longitude: locationStore.selectedLocation.longitude,
        },
        mode,
      );
      if (coords.length === 0) {
        Alert.alert("Rute Tidak Tersedia", "Tidak ada rute yang ditemukan untuk mode transportasi ini.");
        setRouteCoords([]);
      } else {
        setRouteCoords(coords);
      }
    } catch (e) {
      console.error("Route error:", e);
      Alert.alert("Gagal", "Tidak dapat mengambil rute. Periksa koneksi internet.");
    } finally {
      setRouteLoading(false);
    }
  };

  const handlemarkerPress = async (location: any) => {
    locationStore.selectLocation(location);
    await reviewStore.fetchReviews(location.id);
    await reviewStore.fetchAverageRating(location.id);
  };

  const handleSearchChange = (text: string) => {
    locationStore.setSearchKeyword(text);
    if (text.length > 2) {
      locationStore.searchLocations(text);
    } else if (text.length === 0) {
      locationStore.clearSelection();
    }
  };

  return (
    <View style={styles.container}>
      {/* Map */}
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={DEFAULT_REGION}
        showsUserLocation={true}
        showsMyLocationButton={false}
        onRegionChangeComplete={(region) => {
          currentRegion.current = region;
          setLatDelta(region.latitudeDelta);
        }}
      >
        {/* Heatmap — density circles per location */}
        {showHeatmap &&
          locationStore.getFilteredLocations.map((location) => (
            <Circle
              key={`heat-${location.id}`}
              center={{
                latitude: location.latitude,
                longitude: location.longitude,
              }}
              radius={600}
              fillColor="rgba(239,68,68,0.15)"
              strokeColor="rgba(239,68,68,0.3)"
              strokeWidth={1}
            />
          ))}

        {/* Clustered / individual markers */}
        {clusterLocations(locationStore.getFilteredLocations, latDelta).map(
          (cluster: Cluster) =>
            cluster.count === 1 ? (
              <Marker
                key={cluster.id}
                coordinate={{
                  latitude: cluster.latitude,
                  longitude: cluster.longitude,
                }}
                onPress={() => handlemarkerPress(cluster.locations[0])}
                tracksViewChanges={false}
              >
                <LocationMarker
                  location={cluster.locations[0]}
                  onPress={() => handlemarkerPress(cluster.locations[0])}
                />
              </Marker>
            ) : (
              <Marker
                key={cluster.id}
                coordinate={{
                  latitude: cluster.latitude,
                  longitude: cluster.longitude,
                }}
                onPress={() => {
                  // Zoom into the cluster center
                  mapRef.current?.animateToRegion(
                    {
                      latitude: cluster.latitude,
                      longitude: cluster.longitude,
                      latitudeDelta: latDelta / 3,
                      longitudeDelta: latDelta / 3,
                    },
                    350,
                  );
                }}
                tracksViewChanges={false}
              >
                <ClusterMarker count={cluster.count} />
              </Marker>
            ),
        )}
        {routeCoords.length > 0 && (
          <Polyline
            coordinates={routeCoords}
            strokeColor={routeColor}
            strokeWidth={4}
          />
        )}
      </MapView>

      {/* Zoom + GPS + Refresh + AI Controls */}
      <View style={styles.zoomContainer}>
        {/* GPS */}
        <TouchableOpacity
          style={styles.zoomButton}
          onPress={() => {
            if (userLocation) {
              mapRef.current?.animateToRegion(
                { ...userLocation, latitudeDelta: 0.05, longitudeDelta: 0.05 },
                500,
              );
            }
          }}
        >
          <MaterialIcons name="my-location" size={22} color="#374151" />
        </TouchableOpacity>

        {/* Refresh */}
        <TouchableOpacity
          style={styles.zoomButton}
          onPress={() => locationStore.fetchLocations(100)}
        >
          <MaterialIcons name="refresh" size={22} color="#374151" />
        </TouchableOpacity>

        {/* Zoom in */}
        <TouchableOpacity
          style={styles.zoomButton}
          onPress={() => handleZoom("in")}
        >
          <MaterialIcons name="add" size={22} color="#374151" />
        </TouchableOpacity>

        {/* Zoom out */}
        <TouchableOpacity
          style={styles.zoomButton}
          onPress={() => handleZoom("out")}
        >
          <MaterialIcons name="remove" size={22} color="#374151" />
        </TouchableOpacity>

        {/* Heatmap toggle */}
        <TouchableOpacity
          style={[styles.zoomButton, showHeatmap && styles.zoomButtonActive]}
          onPress={() => setShowHeatmap((v) => !v)}
        >
          <MaterialIcons
            name="whatshot"
            size={22}
            color={showHeatmap ? "#ef4444" : "#374151"}
          />
        </TouchableOpacity>

        {/* AI Button */}
        <TouchableOpacity
          style={styles.aiButton}
          onPress={() =>
            Alert.alert("AI Assistant", "Fitur ini sedang dalam pengembangan")
          }
        >
          <Animated.View style={{ transform: [{ scale: aiPulse }] }}>
            <MaterialIcons name="auto-awesome" size={22} color="#fff" />
          </Animated.View>
        </TouchableOpacity>
      </View>

      {/* Search Bar + Logout Row */}
      <View style={styles.topBar}>
        <View style={styles.searchWrapper}>
          <SearchBar
            value={locationStore.searchKeyword}
            onChangeText={handleSearchChange}
            placeholder="Cari lokasi..."
            results={
              locationStore.searchKeyword.length > 2
                ? locationStore.getFilteredLocations
                : []
            }
            onSelectResult={async (location) => {
              await handlemarkerPress(location);
              mapRef.current?.animateToRegion(
                {
                  latitude: location.latitude,
                  longitude: location.longitude,
                  latitudeDelta: 0.02,
                  longitudeDelta: 0.02,
                },
                500,
              );
            }}
          />
        </View>

        {authStore.isAuthenticated && (
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={() => {
              Alert.alert("Logout", "Yakin ingin keluar?", [
                { text: "Batal", style: "cancel" },
                {
                  text: "Ya, Keluar",
                  style: "destructive",
                  onPress: () => authStore.logout(),
                },
              ]);
            }}
          >
            <MaterialIcons name="logout" size={20} color="#ef4444" />
          </TouchableOpacity>
        )}
      </View>

      {/* Loading */}
      {locationStore.loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#3b82f6" />
        </View>
      )}

      {/* Location Detail Sheet — shown above category filter */}
      {/* Review Modal */}
      <ReviewModal
        visible={showReviewModal}
        location={locationStore.selectedLocation}
        loading={reviewStore.loading}
        onClose={() => setShowReviewModal(false)}
        onSubmit={async (rating, comment) => {
          if (!authStore.user || !locationStore.selectedLocation) return;
          await reviewStore.createReview(
            authStore.user.id,
            locationStore.selectedLocation.id,
            rating,
            comment,
          );
          if (reviewStore.error) {
            Alert.alert(
              "Gagal",
              reviewStore.error.message ?? "Gagal menyimpan ulasan",
            );
          } else {
            setShowReviewModal(false);
          }
        }}
      />

      {locationStore.selectedLocation ? (
        <View style={styles.detailContainer}>
          <LocationDetail
            location={locationStore.selectedLocation}
            reviews={reviewStore.reviews}
            averageRating={reviewStore.averageRating}
            loading={reviewStore.loading}
            userLocation={userLocation || undefined}
            onReviewPress={() => {
              if (!authStore.isAuthenticated) {
                navigation.navigate("Login");
              } else {
                setShowReviewModal(true);
              }
            }}
            onClosePress={() => {
              locationStore.clearSelection();
              reviewStore.reset();
              setRouteCoords([]);
            }}
            onRoutePress={handleRoutePress}
            routeLoading={routeLoading}
            transportMode={transportMode}
            onTransportModeChange={setTransportMode}
          />
        </View>
      ) : (
        <CategoryFilter
          categories={locationStore.categories}
          selectedCategory={locationStore.selectedCategory}
          onSelectCategory={(categoryId) =>
            locationStore.selectCategory(categoryId)
          }
        />
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  map: {
    flex: 1,
  },
  searchContainer: {
    position: "absolute",
    top: 50,
    left: 0,
    right: 0,
    zIndex: 5,
    margin: 10,
  },
  topBar: {
    position: "absolute",
    top: 50,
    left: 0,
    right: 0,
    zIndex: 5,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    gap: 8,
  },
  searchWrapper: {
    marginTop: 10,
    flex: 1,
  },
  userMarker: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#3b82f6",
    borderWidth: 3,
    borderColor: "#fff",
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  detailContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 8,
  },
  zoomContainer: {
    position: "absolute",
    right: 16,
    bottom: 120,
    zIndex: 6,
    gap: 8,
  },
  zoomButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  zoomButtonActive: {
    backgroundColor: "#fee2e2",
  },
  aiButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#6366f1",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#6366f1",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
    elevation: 6,
    marginBottom: 100,
  },
  logoutButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
    marginTop: 10,
    marginEnd: 10,
  },
});

export default MapScreen;
