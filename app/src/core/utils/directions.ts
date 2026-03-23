export interface RouteCoordinate {
  latitude: number;
  longitude: number;
}

export type TransportMode = "driving" | "walking" | "cycling";

const OSRM_PROFILE: Record<TransportMode, string> = {
  driving: "https://router.project-osrm.org/route/v1/driving",
  walking: "https://routing.openstreetmap.de/routed-foot/route/v1/foot",
  cycling: "https://routing.openstreetmap.de/routed-bike/route/v1/bike",
};

// Free routing via OSRM public demo server — no API key required
export async function fetchDirections(
  origin: RouteCoordinate,
  destination: RouteCoordinate,
  mode: TransportMode = "driving",
): Promise<RouteCoordinate[]> {
  const base = OSRM_PROFILE[mode];
  const url =
    `${base}/` +
    `${origin.longitude},${origin.latitude};` +
    `${destination.longitude},${destination.latitude}` +
    `?overview=full&geometries=geojson`;

  const response = await fetch(url);
  const data = await response.json();

  if (data.code === "NoRoute" || !data.routes?.length) {
    // No route available for this mode — return empty so caller clears polyline
    return [];
  }

  if (data.code !== "Ok") {
    throw new Error(`OSRM error: ${data.code}`);
  }

  // GeoJSON coordinates are [longitude, latitude] — swap to RN Maps format
  return data.routes[0].geometry.coordinates.map(
    ([lng, lat]: [number, number]) => ({
      latitude: lat,
      longitude: lng,
    }),
  );
}
