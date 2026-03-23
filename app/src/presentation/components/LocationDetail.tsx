import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Location, Review } from "../../domain/entities";
import { calculateDistance, formatDistance } from "../../core/utils/helpers";
import { TransportMode } from "../../core/utils/directions";

interface LocationDetailProps {
  location: Location | null;
  reviews: Review[];
  averageRating: number;
  loading: boolean;
  userLocation?: { latitude: number; longitude: number };
  onReviewPress: () => void;
  onClosePress: () => void;
  onRoutePress: (mode: TransportMode) => void;
  routeLoading?: boolean;
  transportMode?: TransportMode;
  onTransportModeChange?: (mode: TransportMode) => void;
}

const CATEGORY_COLOR: Record<string, string> = {
  wisata: "#22c55e",
  health: "#ef4444",
  hotel: "#3b82f6",
};

const TRANSPORT_MODES: { mode: TransportMode; icon: string; label: string }[] = [
  { mode: "driving", icon: "directions-car", label: "Mobil" },
  { mode: "walking", icon: "directions-walk", label: "Jalan" },
  { mode: "cycling", icon: "directions-bike", label: "Sepeda" },
];

export const LocationDetail: React.FC<LocationDetailProps> = ({
  location,
  reviews,
  averageRating,
  loading,
  userLocation,
  onReviewPress,
  onClosePress,
  onRoutePress,
  routeLoading = false,
  transportMode: externalMode,
  onTransportModeChange,
}) => {
  const [internalMode, setInternalMode] = useState<TransportMode>("driving");
  const activeMode = externalMode ?? internalMode;

  const setMode = (m: TransportMode) => {
    setInternalMode(m);
    onTransportModeChange?.(m);
  };

  if (!location) return null;

  let distance: string | null = null;
  if (userLocation) {
    const distanceKm = calculateDistance(
      userLocation.latitude,
      userLocation.longitude,
      location.latitude,
      location.longitude,
    );
    distance = formatDistance(distanceKm);
  }

  const categoryName = location.category?.name?.toLowerCase() || "";
  const routeColor = CATEGORY_COLOR[categoryName] ?? "#6b7280";

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.closeButton} onPress={onClosePress}>
        <Text style={styles.closeButtonText}>×</Text>
      </TouchableOpacity>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>{location.name}</Text>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Category:</Text>
          <Text style={styles.value}>{location.category?.name || "N/A"}</Text>
        </View>

        {distance && (
          <View style={styles.infoRow}>
            <Text style={styles.label}>Distance:</Text>
            <Text style={styles.value}>{distance}</Text>
          </View>
        )}

        <View style={styles.infoRow}>
          <Text style={styles.label}>Rating:</Text>
          <Text style={styles.value}>
            ⭐ {averageRating > 0 ? averageRating.toFixed(1) : "No ratings"}
          </Text>
        </View>

        {location.description && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>{location.description}</Text>
          </View>
        )}

        {location.address && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Address</Text>
            <Text style={styles.address}>{location.address}</Text>
          </View>
        )}

        {reviews.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recent Reviews</Text>
            {reviews.slice(0, 3).map((review) => (
              <View key={review.id} style={styles.reviewItem}>
                <View style={styles.reviewHeader}>
                  <Text style={styles.reviewRating}>
                    {"⭐".repeat(review.rating)}
                  </Text>
                </View>
                {review.comment && (
                  <Text style={styles.reviewComment}>{review.comment}</Text>
                )}
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      <View style={styles.buttonRow}>
        {/* Route buttons — one per transport mode */}
        {TRANSPORT_MODES.map(({ mode, icon, label }) => {
          const isActive = activeMode === mode;
          const isLoading = routeLoading && isActive;
          return (
            <TouchableOpacity
              key={mode}
              style={[
                styles.routeButton,
                { borderColor: routeColor },
                isActive && { backgroundColor: routeColor },
              ]}
              onPress={() => {
                setMode(mode);
                onRoutePress(mode);
              }}
              disabled={routeLoading || !userLocation}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color={isActive ? "#fff" : routeColor} />
              ) : (
                <>
                  <MaterialIcons
                    name={icon as any}
                    size={16}
                    color={isActive ? "#fff" : routeColor}
                  />
                  <Text style={[styles.routeButtonText, { color: isActive ? "#fff" : routeColor }]}>
                    {label}
                  </Text>
                </>
              )}
            </TouchableOpacity>
          );
        })}

        <TouchableOpacity
          style={styles.reviewButton}
          onPress={onReviewPress}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.reviewButtonText}>Review</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    paddingHorizontal: 16,
    paddingBottom: 16,
    maxHeight: "80%",
  },
  closeButton: {
    position: "absolute",
    top: 12,
    right: 16,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#f3f4f6",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  closeButtonText: {
    fontSize: 24,
    lineHeight: 32,
    color: "#6b7280",
  },
  content: {
    maxHeight: 300,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1f2937",
    marginBottom: 12,
    marginRight: 32,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6b7280",
  },
  value: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1f2937",
  },
  section: {
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1f2937",
    marginBottom: 8,
  },
  description: {
    fontSize: 13,
    color: "#4b5563",
    lineHeight: 18,
  },
  address: {
    fontSize: 13,
    color: "#4b5563",
    lineHeight: 18,
  },
  reviewItem: {
    backgroundColor: "#f9fafb",
    padding: 10,
    borderRadius: 8,
    marginBottom: 8,
  },
  reviewHeader: {
    marginBottom: 6,
  },
  reviewRating: {
    fontSize: 12,
  },
  reviewComment: {
    fontSize: 12,
    color: "#4b5563",
    lineHeight: 16,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 8,
  },
  routeButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
    gap: 3,
  },
  routeButtonText: {
    fontSize: 11,
    fontWeight: "700",
  },
  reviewButton: {
    flex: 1,
    backgroundColor: "#3b82f6",
    paddingVertical: 12,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  reviewButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
});
