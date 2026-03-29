"use client";

import { useMemo } from "react";
import { Marker } from "react-leaflet";
import L from "leaflet";
import type { Cluster } from "@/core/utils/clustering";

function createClusterIcon(count: number): L.DivIcon {
  const size = count > 50 ? 48 : count > 10 ? 42 : 36;
  const html = `
    <div style="
      width:${size}px;height:${size}px;border-radius:50%;
      background-color:#3b82f6;border:2.5px solid #1d4ed8;
      display:flex;align-items:center;justify-content:center;
      color:#fff;font-size:13px;font-weight:700;
      box-shadow:0 2px 8px rgba(59,130,246,0.45);
    ">${count}</div>`;

  return L.divIcon({
    html,
    className: "",
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}

interface Props {
  cluster: Cluster;
  onPress: (cluster: Cluster) => void;
}

export default function ClusterPin({ cluster, onPress }: Props) {
  const icon = useMemo(() => createClusterIcon(cluster.count), [cluster.count]);

  return (
    <Marker
      position={[cluster.latitude, cluster.longitude]}
      icon={icon}
      eventHandlers={{ click: () => onPress(cluster) }}
    />
  );
}
