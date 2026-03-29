"use client";

import { Satellite, Flame, Plus, Minus, Crosshair, RefreshCw } from "lucide-react";

interface Props {
  isSatellite: boolean;
  showHeatmap: boolean;
  onToggleSatellite: () => void;
  onToggleHeatmap: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onLocateMe: () => void;
  onRefresh: () => void;
  isRefreshing: boolean;
}

interface ControlButtonProps {
  onClick: () => void;
  active?: boolean;
  activeColor?: string;
  title: string;
  children: React.ReactNode;
  disabled?: boolean;
}

function ControlButton({ onClick, active, activeColor = "bg-blue-50", title, children, disabled }: ControlButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`w-10 h-10 rounded-full flex items-center justify-center shadow border transition-all ${
        active
          ? `${activeColor} border-current`
          : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
      } disabled:opacity-50`}
    >
      {children}
    </button>
  );
}

export default function MapControls({
  isSatellite,
  showHeatmap,
  onToggleSatellite,
  onToggleHeatmap,
  onZoomIn,
  onZoomOut,
  onLocateMe,
  onRefresh,
  isRefreshing,
}: Props) {
  return (
    <div className="flex flex-col gap-2">
      <ControlButton onClick={onLocateMe} title="Lokasi saya">
        <Crosshair size={18} />
      </ControlButton>

      <ControlButton
        onClick={onRefresh}
        disabled={isRefreshing}
        title="Refresh lokasi"
      >
        <RefreshCw size={18} className={isRefreshing ? "animate-spin" : ""} />
      </ControlButton>

      <ControlButton onClick={onZoomIn} title="Zoom in">
        <Plus size={18} />
      </ControlButton>

      <ControlButton onClick={onZoomOut} title="Zoom out">
        <Minus size={18} />
      </ControlButton>

      <ControlButton
        onClick={onToggleSatellite}
        active={isSatellite}
        activeColor="bg-blue-50 text-blue-600"
        title="Tampilan satelit"
      >
        <Satellite size={18} className={isSatellite ? "text-blue-600" : ""} />
      </ControlButton>

      <ControlButton
        onClick={onToggleHeatmap}
        active={showHeatmap}
        activeColor="bg-red-50 text-red-500"
        title="Tampilan heatmap"
      >
        <Flame size={18} className={showHeatmap ? "text-red-500" : ""} />
      </ControlButton>
    </div>
  );
}
