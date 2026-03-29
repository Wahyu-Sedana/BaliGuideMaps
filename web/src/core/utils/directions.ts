export type TransportMode = "driving" | "walking" | "cycling";

export interface Coordinate {
  lat: number;
  lng: number;
}

const OSRM_PROFILES: Record<TransportMode, string> = {
  driving: "driving",
  walking: "foot",
  cycling: "cycling",
};

export async function fetchDirections(
  from: Coordinate,
  to: Coordinate,
  mode: TransportMode = "driving",
): Promise<Coordinate[]> {
  const profile = OSRM_PROFILES[mode];
  const url = `https://router.project-osrm.org/route/v1/${profile}/${from.lng},${from.lat};${to.lng},${to.lat}?overview=full&geometries=geojson`;

  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch directions");

  const json = await res.json();
  if (!json.routes?.length) return [];

  const coords: [number, number][] = json.routes[0].geometry.coordinates;
  return coords.map(([lng, lat]) => ({ lat, lng }));
}
