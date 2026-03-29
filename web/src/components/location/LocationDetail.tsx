"use client";

import { useState } from "react";
import { X, Star, MapPin, Navigation, Car, Footprints, Bike } from "lucide-react";
import type { Location, Review } from "@/domain/entities";
import type { TransportMode } from "@/core/utils/directions";

interface Props {
  location: Location;
  reviews: Review[];
  averageRating: number;
  reviewsLoading: boolean;
  onClose: () => void;
  onReviewPress: () => void;
  onRoutePress: (mode: TransportMode) => void;
  routeLoading: boolean;
  transportMode: TransportMode;
  onTransportModeChange: (mode: TransportMode) => void;
}

const CATEGORY_BADGE: Record<string, string> = {
  wisata: "bg-green-100 text-green-700",
  health: "bg-red-100 text-red-700",
  hotel: "bg-blue-100 text-blue-700",
  restoran: "bg-orange-100 text-orange-700",
  pura: "bg-purple-100 text-purple-700",
};

const TRANSPORT_MODES: { mode: TransportMode; icon: React.ReactNode; label: string }[] = [
  { mode: "driving", icon: <Car size={16} />, label: "Mobil" },
  { mode: "walking", icon: <Footprints size={16} />, label: "Jalan" },
  { mode: "cycling", icon: <Bike size={16} />, label: "Sepeda" },
];

export default function LocationDetail({
  location,
  reviews,
  averageRating,
  reviewsLoading,
  onClose,
  onReviewPress,
  onRoutePress,
  routeLoading,
  transportMode,
  onTransportModeChange,
}: Props) {
  const [tab, setTab] = useState<"info" | "reviews">("info");
  const catKey = location.category?.name?.toLowerCase() ?? "";
  const badgeClass = CATEGORY_BADGE[catKey] ?? "bg-gray-100 text-gray-600";

  return (
    <div className="bg-white rounded-t-2xl shadow-xl max-h-[60vh] flex flex-col">
      {/* Header */}
      <div className="flex items-start justify-between px-4 pt-4 pb-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${badgeClass}`}>
              {location.category?.name ?? "Lainnya"}
            </span>
            {averageRating > 0 && (
              <span className="flex items-center gap-0.5 text-xs text-yellow-500 font-medium">
                <Star size={12} className="fill-yellow-400" />
                {averageRating.toFixed(1)}
              </span>
            )}
          </div>
          <h2 className="text-base font-semibold text-gray-900 truncate">{location.name}</h2>
          <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
            <MapPin size={12} />
            {location.address}
          </p>
        </div>
        <button onClick={onClose} className="ml-2 text-gray-400 hover:text-gray-600 p-1">
          <X size={18} />
        </button>
      </div>

      {/* Route buttons */}
      <div className="px-4 pb-2 flex items-center gap-2">
        <div className="flex gap-1 bg-gray-100 rounded-lg p-0.5">
          {TRANSPORT_MODES.map(({ mode, icon, label }) => (
            <button
              key={mode}
              onClick={() => onTransportModeChange(mode)}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-medium transition-all ${
                transportMode === mode
                  ? "bg-white text-gray-800 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {icon}
              {label}
            </button>
          ))}
        </div>
        <button
          onClick={() => onRoutePress(transportMode)}
          disabled={routeLoading}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-500 text-white text-xs font-medium hover:bg-blue-600 disabled:opacity-50 transition-colors"
        >
          <Navigation size={14} />
          {routeLoading ? "..." : "Rute"}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-100 px-4">
        {(["info", "reviews"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-3 py-2 text-sm font-medium border-b-2 transition-colors capitalize ${
              tab === t
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-400 hover:text-gray-600"
            }`}
          >
            {t === "info" ? "Info" : `Ulasan (${reviews.length})`}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 py-3">
        {tab === "info" ? (
          <div className="space-y-3">
            {location.description ? (
              <p className="text-sm text-gray-600 leading-relaxed">{location.description}</p>
            ) : (
              <p className="text-sm text-gray-400 italic">Belum ada deskripsi</p>
            )}
            <div className="pt-1 space-y-1.5 border-t border-gray-50">
              {location.address && (
                <div className="flex items-start gap-2">
                  <MapPin size={13} className="text-gray-400 mt-0.5 shrink-0" />
                  <span className="text-xs text-gray-500">{location.address}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Navigation size={13} className="text-gray-400 shrink-0" />
                <span className="text-xs text-gray-400 font-mono">
                  {location.latitude.toFixed(5)}, {location.longitude.toFixed(5)}
                </span>
              </div>
            </div>
          </div>
        ) : reviewsLoading ? (
          <div className="flex justify-center py-6">
            <div className="w-5 h-5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : reviews.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-6">Belum ada ulasan</p>
        ) : (
          <div className="space-y-3">
            {reviews.map((review) => (
              <div key={review.id} className="pb-3 border-b border-gray-50 last:border-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-medium text-gray-700">
                    {review.user?.name ?? "Pengguna"}
                  </span>
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        size={11}
                        className={s <= review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-200"}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-gray-500">{review.comment}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Review button */}
      <div className="px-4 py-3 border-t border-gray-100">
        <button
          onClick={onReviewPress}
          className="w-full py-2 rounded-xl text-sm font-medium bg-gray-800 text-white hover:bg-gray-900 transition-colors"
        >
          Tulis Ulasan
        </button>
      </div>
    </div>
  );
}
