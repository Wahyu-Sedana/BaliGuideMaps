"use client";

import { Polyline } from "react-leaflet";
import type { Coordinate } from "@/core/utils/directions";

interface Props {
  coords: Coordinate[];
  color: string;
}

export default function RoutePolyline({ coords, color }: Props) {
  const positions: [number, number][] = coords.map((c) => [c.lat, c.lng]);
  return <Polyline positions={positions} pathOptions={{ color, weight: 4, opacity: 0.85 }} />;
}
