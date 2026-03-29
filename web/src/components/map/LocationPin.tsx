"use client";

import { useMemo } from "react";
import { Marker, Tooltip } from "react-leaflet";
import L from "leaflet";
import type { Location } from "@/domain/entities";

// SVG paths (Lucide icon paths inline — no renderToStaticMarkup needed)
const CATEGORY_CONFIG: Record<string, { color: string; bg: string; path: string }> = {
  wisata: {
    color: "#16a34a",
    bg: "#dcfce7",
    path: `<path d="M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5s2.4 2 5 2 2.5-2 5-2 1.9.5 2.5 1"/>
           <path d="M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2s2.4 2 5 2 2.5-2 5-2 1.9.5 2.5 1"/>`,
  },
  health: {
    color: "#dc2626",
    bg: "#fee2e2",
    path: `<path d="M12 2v20"/><path d="M2 12h20"/>`,
  },
  hotel: {
    color: "#2563eb",
    bg: "#dbeafe",
    path: `<path d="M3 22V8a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14"/>
           <path d="M3 22h18"/>
           <path d="M9 22v-4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v4"/>`,
  },
  restoran: {
    color: "#ea580c",
    bg: "#ffedd5",
    path: `<path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/>
           <path d="M7 2v20"/>
           <path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3v4"/>`,
  },
  pura: {
    color: "#7c3aed",
    bg: "#ede9fe",
    path: `<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
           <circle cx="12" cy="10" r="3"/>`,
  },
};

const DEFAULT_CONFIG = {
  color: "#6b7280",
  bg: "#f3f4f6",
  path: `<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
         <circle cx="12" cy="10" r="3"/>`,
};

function createPinIcon(catName: string, selected: boolean): L.DivIcon {
  const cfg = CATEGORY_CONFIG[catName?.toLowerCase() ?? ""] ?? DEFAULT_CONFIG;
  const size = selected ? 40 : 34;
  const shadow = selected
    ? `0 0 0 3px ${cfg.color}40, 0 2px 8px rgba(0,0,0,0.2)`
    : "0 2px 6px rgba(0,0,0,0.15)";

  const html = `
    <div style="
      width:${size}px;height:${size}px;border-radius:50%;
      background-color:${cfg.bg};
      border:2.5px solid ${cfg.color};
      display:flex;align-items:center;justify-content:center;
      box-shadow:${shadow};
    ">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
           stroke="${cfg.color}" stroke-width="2.5"
           stroke-linecap="round" stroke-linejoin="round">
        ${cfg.path}
      </svg>
    </div>`;

  return L.divIcon({
    html,
    className: "",
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}

interface Props {
  location: Location;
  isSelected: boolean;
  onPress: (location: Location) => void;
}

export default function LocationPin({ location, isSelected, onPress }: Props) {
  const icon = useMemo(
    () => createPinIcon(location.category?.name ?? "", isSelected),
    [location.category?.name, isSelected],
  );

  return (
    <Marker
      position={[location.latitude, location.longitude]}
      icon={icon}
      eventHandlers={{ click: () => onPress(location) }}
      zIndexOffset={isSelected ? 1000 : 0}
    >
      <Tooltip direction="top" offset={[0, -20]} opacity={0.92}>
        {location.name}
      </Tooltip>
    </Marker>
  );
}
