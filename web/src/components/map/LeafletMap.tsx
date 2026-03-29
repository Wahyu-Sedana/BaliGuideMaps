"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { MapContainer, TileLayer, Marker, useMap, useMapEvents, Circle } from "react-leaflet";
import L from "leaflet";
import type { Location } from "@/domain/entities";
import type { Coordinate } from "@/core/utils/directions";
import { clusterLocations } from "@/core/utils/clustering";
import LocationPin from "./LocationPin";
import ClusterPin from "./ClusterPin";
import RoutePolyline from "./RoutePolyline";

// Fix default leaflet icon path in Next.js
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// Tile layers
const TILES = {
  standard: {
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  },
  satellite: {
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    attribution: "Tiles &copy; Esri",
  },
};

// User location icon — pulsing blue dot
const USER_LOCATION_ICON = L.divIcon({
  html: `
    <div style="position:relative;width:20px;height:20px">
      <div class="user-loc-pulse" style="
        position:absolute;inset:0;border-radius:50%;
        background:rgba(59,130,246,0.4);
      "></div>
      <div style="
        position:absolute;top:50%;left:50%;
        transform:translate(-50%,-50%);
        width:14px;height:14px;border-radius:50%;
        background:#3b82f6;border:2.5px solid #fff;
        box-shadow:0 1px 6px rgba(0,0,0,0.3);
      "></div>
    </div>`,
  className: "",
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

// Sub-component: expose map instance to parent
function MapReadyCallback({ onReady }: { onReady: (map: L.Map) => void }) {
  const map = useMap();
  useEffect(() => { onReady(map); }, [map, onReady]);
  return null;
}

// Sub-component: track zoom level
function ZoomTracker({ onZoom }: { onZoom: (delta: number) => void }) {
  const map = useMapEvents({
    zoomend: () => {
      const bounds = map.getBounds();
      onZoom(bounds.getNorth() - bounds.getSouth());
    },
  });
  return null;
}

// Sub-component: fly to target imperatively
function FlyTo({ target }: { target: { lat: number; lng: number; zoom?: number } | null }) {
  const map = useMap();
  useEffect(() => {
    if (target) map.flyTo([target.lat, target.lng], target.zoom ?? 15, { duration: 0.8 });
  }, [map, target]);
  return null;
}

interface Props {
  locations: Location[];
  selectedLocation: Location | null;
  onSelectLocation: (loc: Location) => void;
  route: Coordinate[];
  routeColor: string;
  isSatellite: boolean;
  showHeatmap: boolean;
  flyTarget: { lat: number; lng: number; zoom?: number } | null;
  userLocation: { lat: number; lng: number } | null;
  onMapReady: (map: L.Map) => void;
}

export default function LeafletMap({
  locations,
  selectedLocation,
  onSelectLocation,
  route,
  routeColor,
  isSatellite,
  showHeatmap,
  flyTarget,
  userLocation,
  onMapReady,
}: Props) {
  const [latDelta, setLatDelta] = useState(0.1);
  const mapRef = useRef<L.Map | null>(null);

  const handleZoom = useCallback((delta: number) => setLatDelta(delta), []);

  const clusters = clusterLocations(locations, latDelta);
  const tile = isSatellite ? TILES.satellite : TILES.standard;

  return (
    <MapContainer
      center={[-8.6705, 115.2126]}
      zoom={12}
      style={{ width: "100%", height: "100%" }}
      ref={mapRef}
      zoomControl={false}
    >
      <TileLayer url={tile.url} attribution={tile.attribution} />

      <MapReadyCallback onReady={onMapReady} />
      <ZoomTracker onZoom={handleZoom} />
      <FlyTo target={flyTarget} />

      {/* User location blue dot */}
      {userLocation && (
        <Marker
          position={[userLocation.lat, userLocation.lng]}
          icon={USER_LOCATION_ICON}
          zIndexOffset={2000}
        />
      )}

      {/* Heatmap circles */}
      {showHeatmap &&
        locations.map((loc) => (
          <Circle
            key={`heat-${loc.id}`}
            center={[loc.latitude, loc.longitude]}
            radius={600}
            pathOptions={{ color: "rgba(239,68,68,0.6)", fillColor: "rgba(239,68,68,0.15)", fillOpacity: 1 }}
          />
        ))}

      {/* Clusters / markers */}
      {clusters.map((cluster) =>
        cluster.count === 1 ? (
          <LocationPin
            key={cluster.id}
            location={cluster.locations[0]}
            isSelected={selectedLocation?.id === cluster.locations[0].id}
            onPress={onSelectLocation}
          />
        ) : (
          <ClusterPin
            key={cluster.id}
            cluster={cluster}
            onPress={(c) => {
              mapRef.current?.flyTo([c.latitude, c.longitude], (mapRef.current?.getZoom() ?? 12) + 2, {
                duration: 0.5,
              });
            }}
          />
        ),
      )}

      {/* Route polyline */}
      {route.length > 0 && <RoutePolyline coords={route} color={routeColor} />}
    </MapContainer>
  );
}
