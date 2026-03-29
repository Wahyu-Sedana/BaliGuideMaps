import type { Location } from "@/domain/entities";

export interface Cluster {
  id: string;
  latitude: number;
  longitude: number;
  count: number;
  locations: Location[];
}

export function clusterLocations(locations: Location[], latDelta: number): Cluster[] {
  const cellSize = latDelta / 4;

  if (cellSize < 0.005) {
    return locations.map((loc) => ({
      id: loc.id,
      latitude: loc.latitude,
      longitude: loc.longitude,
      count: 1,
      locations: [loc],
    }));
  }

  const grid = new Map<string, Location[]>();

  for (const loc of locations) {
    const row = Math.floor(loc.latitude / cellSize);
    const col = Math.floor(loc.longitude / cellSize);
    const key = `${row}:${col}`;
    const cell = grid.get(key) ?? [];
    cell.push(loc);
    grid.set(key, cell);
  }

  return Array.from(grid.entries()).map(([key, locs]) => {
    const lat = locs.reduce((s, l) => s + l.latitude, 0) / locs.length;
    const lng = locs.reduce((s, l) => s + l.longitude, 0) / locs.length;
    return {
      id: `cluster-${key}`,
      latitude: lat,
      longitude: lng,
      count: locs.length,
      locations: locs,
    };
  });
}
