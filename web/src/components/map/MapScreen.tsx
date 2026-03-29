"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { LogOut, Map as MapIcon } from "lucide-react";
import L from "leaflet";
import { useLocations, useCategories, useSearchLocations } from "@/hooks/useLocations";
import { useReviews, useCreateReview } from "@/hooks/useReviews";
import { useLocationStore } from "@/store/locationStore";
import { useAuthStore } from "@/store/authStore";
import type { Location } from "@/domain/entities";
import type { TransportMode, Coordinate } from "@/core/utils/directions";
import { fetchDirections } from "@/core/utils/directions";
import SearchBar from "@/components/ui/SearchBar";
import CategoryFilter from "@/components/ui/CategoryFilter";
import LocationDetail from "@/components/location/LocationDetail";
import ReviewModal from "@/components/ui/ReviewModal";
import MapControls from "./MapControls";

const LeafletMap = dynamic(() => import("./LeafletMap"), { ssr: false });

const ROUTE_COLORS: Record<string, string> = {
  wisata: "#22c55e",
  health: "#ef4444",
  hotel: "#3b82f6",
};

export default function MapScreen() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuthStore();
  const {
    selectedLocation,
    selectedCategory,
    searchKeyword,
    isSatellite,
    showHeatmap,
    selectLocation,
    selectCategory,
    setSearchKeyword,
    toggleSatellite,
    toggleHeatmap,
    getFilteredLocations,
  } = useLocationStore();

  const { data: allLocations = [], isLoading: locLoading, refetch } = useLocations();
  const { data: categories = [] } = useCategories();
  const { data: searchResults = [] } = useSearchLocations(searchKeyword);
  const { data: reviewData, isLoading: reviewsLoading } = useReviews(selectedLocation?.id ?? null);
  const createReview = useCreateReview();

  const [route, setRoute] = useState<Coordinate[]>([]);
  const [routeColor, setRouteColor] = useState("#6b7280");
  const [routeLoading, setRouteLoading] = useState(false);
  const [transportMode, setTransportMode] = useState<TransportMode>("driving");
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [flyTarget, setFlyTarget] = useState<{ lat: number; lng: number; zoom?: number } | null>(null);

  // Real Leaflet map instance — set via onMapReady callback
  const leafletMap = useRef<L.Map | null>(null);
  const handleMapReady = useCallback((map: L.Map) => {
    leafletMap.current = map;
  }, []);

  // Geolocation — watch position for live updates
  useEffect(() => {
    if (!navigator.geolocation) return;

    // Get current position immediately
    navigator.geolocation.getCurrentPosition(
      (pos) => setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => {},
      { enableHighAccuracy: true },
    );

    // Watch for movement
    const watchId = navigator.geolocation.watchPosition(
      (pos) => setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => {},
      { enableHighAccuracy: true, distanceFilter: 10 } as PositionOptions,
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  const filtered = getFilteredLocations(allLocations);
  const displayLocations = searchKeyword.length > 2 ? searchResults : filtered;

  const handleSelectLocation = useCallback(
    (loc: Location) => {
      selectLocation(loc);
      setFlyTarget({ lat: loc.latitude, lng: loc.longitude, zoom: 15 });
      setRoute([]);
    },
    [selectLocation],
  );

  const handleRoutePress = async (mode: TransportMode) => {
    if (!selectedLocation) return;

    if (!userLocation) {
      alert("Aktifkan izin lokasi di browser untuk menggunakan fitur rute.");
      return;
    }

    setRouteLoading(true);
    try {
      const catKey = selectedLocation.category?.name?.toLowerCase() ?? "";
      setRouteColor(ROUTE_COLORS[catKey] ?? "#6b7280");
      const coords = await fetchDirections(
        userLocation,
        { lat: selectedLocation.latitude, lng: selectedLocation.longitude },
        mode,
      );
      if (coords.length === 0) {
        alert("Rute tidak ditemukan untuk mode transportasi ini.");
      } else {
        setRoute(coords);
        // Fly to show both user and destination
        setFlyTarget({ lat: selectedLocation.latitude, lng: selectedLocation.longitude, zoom: 13 });
      }
    } catch {
      alert("Tidak dapat mengambil rute. Periksa koneksi internet.");
    } finally {
      setRouteLoading(false);
    }
  };

  const handleLocateMe = () => {
    if (userLocation) {
      setFlyTarget({ ...userLocation, zoom: 16 });
    } else {
      alert("Lokasi Anda belum tersedia. Pastikan izin lokasi sudah diaktifkan.");
    }
  };

  const handleClose = () => {
    selectLocation(null);
    setRoute([]);
  };

  const handleLogout = () => {
    if (confirm("Yakin ingin keluar?")) logout();
  };

  return (
    <div className="relative w-full overflow-hidden bg-gray-100" style={{ height: "100dvh" }}>
      {/* Map — full screen */}
      <div className="absolute inset-0" style={{ height: "100%" }}>
        <LeafletMap
          locations={displayLocations}
          selectedLocation={selectedLocation}
          onSelectLocation={handleSelectLocation}
          route={route}
          routeColor={routeColor}
          isSatellite={isSatellite}
          showHeatmap={showHeatmap}
          flyTarget={flyTarget}
          userLocation={userLocation}
          onMapReady={handleMapReady}
        />
      </div>

      {/* Top bar */}
      <div className="absolute top-0 left-0 right-0 z-[1001] px-4 pt-4 flex items-start gap-2">
        <div className="flex items-center gap-1.5 bg-white rounded-xl shadow px-3 py-2 shrink-0">
          <MapIcon size={18} className="text-blue-500" />
          <span className="text-sm font-bold text-gray-800">BaliGuide</span>
        </div>

        <div className="flex-1">
          <SearchBar
            value={searchKeyword}
            onChange={setSearchKeyword}
            results={searchKeyword.length > 2 ? searchResults : []}
            onSelect={(loc) => {
              handleSelectLocation(loc);
              setSearchKeyword("");
            }}
          />
        </div>

        {isAuthenticated ? (
          <button
            onClick={handleLogout}
            title="Logout"
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-white shadow text-red-400 hover:text-red-500 hover:bg-red-50 transition-colors shrink-0"
          >
            <LogOut size={18} />
          </button>
        ) : (
          <button
            onClick={() => router.push("/login")}
            className="shrink-0 px-3 py-2 rounded-xl bg-blue-500 text-white text-sm font-medium shadow hover:bg-blue-600 transition-colors"
          >
            Masuk
          </button>
        )}
      </div>

      {/* Loading */}
      {locLoading && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-[1001] bg-white px-4 py-2 rounded-full shadow text-xs text-gray-500 flex items-center gap-2">
          <div className="w-3 h-3 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
          Memuat lokasi...
        </div>
      )}

      {/* Map controls */}
      <div className="absolute right-4 z-[1001]" style={{ top: "50%", transform: "translateY(-50%)" }}>
        <MapControls
          isSatellite={isSatellite}
          showHeatmap={showHeatmap}
          onToggleSatellite={toggleSatellite}
          onToggleHeatmap={toggleHeatmap}
          onZoomIn={() => leafletMap.current?.zoomIn()}
          onZoomOut={() => leafletMap.current?.zoomOut()}
          onLocateMe={handleLocateMe}
          onRefresh={() => refetch()}
          isRefreshing={locLoading}
        />
      </div>

      {/* Bottom area */}
      <div className="absolute bottom-0 left-0 right-0 z-[1001]">
        {selectedLocation ? (
          <>
            <LocationDetail
              location={selectedLocation}
              reviews={reviewData?.data ?? []}
              averageRating={reviewData?.average_rating ?? 0}
              reviewsLoading={reviewsLoading}
              onClose={handleClose}
              onReviewPress={() => {
                if (!isAuthenticated) router.push("/login");
                else setShowReviewModal(true);
              }}
              onRoutePress={handleRoutePress}
              routeLoading={routeLoading}
              transportMode={transportMode}
              onTransportModeChange={setTransportMode}
            />
            {showReviewModal && user && (
              <ReviewModal
                location={selectedLocation}
                onClose={() => setShowReviewModal(false)}
                loading={createReview.isPending}
                onSubmit={async (rating, comment) => {
                  await createReview.mutateAsync({
                    userId: user.id,
                    locationId: selectedLocation.id,
                    rating,
                    comment,
                  });
                  setShowReviewModal(false);
                }}
              />
            )}
          </>
        ) : (
          <div className="px-4 pb-4">
            <CategoryFilter
              categories={categories}
              selectedCategory={selectedCategory}
              onSelect={selectCategory}
            />
          </div>
        )}
      </div>
    </div>
  );
}
