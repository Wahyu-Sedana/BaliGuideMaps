import { Location } from "../../domain/entities";

export interface Cluster {
  id: string;
  latitude: number;
  longitude: number;
  count: number;
  locations: Location[];
}

/**
 * Grid-based spatial clustering.
 * cellSize is in degrees — at zoom ~10, 0.05° ≈ 5km; at zoom ~14, 0.005° ≈ 500m.
 */
export function clusterLocations(
  locations: Location[],
  latDelta: number,
): Cluster[] {
  // Cell size scales with zoom level (latitudeDelta)
  const cellSize = latDelta / 4;

  if (cellSize < 0.005) {
    // Zoomed in enough — show individual markers
    return locations.map((loc) => ({
      id: loc.id,
      latitude: loc.latitude,
      longitude: loc.longitude,
      count: 1,
      locations: [loc],
    }));
  }

  const cells = new Map<string, Location[]>();

  for (const loc of locations) {
    const cellX = Math.floor(loc.longitude / cellSize);
    const cellY = Math.floor(loc.latitude / cellSize);
    const key = `${cellX}:${cellY}`;
    if (!cells.has(key)) cells.set(key, []);
    cells.get(key)!.push(loc);
  }

  const clusters: Cluster[] = [];
  cells.forEach((locs, key) => {
    const avgLat = locs.reduce((s, l) => s + l.latitude, 0) / locs.length;
    const avgLng = locs.reduce((s, l) => s + l.longitude, 0) / locs.length;
    clusters.push({
      id: `cluster-${key}`,
      latitude: avgLat,
      longitude: avgLng,
      count: locs.length,
      locations: locs,
    });
  });

  return clusters;
}
