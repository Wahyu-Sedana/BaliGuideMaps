"use client";

import { useState } from "react";
import { Star, X } from "lucide-react";
import type { Location } from "@/domain/entities";

interface Props {
  location: Location;
  onClose: () => void;
  onSubmit: (rating: number, comment: string) => Promise<void>;
  loading: boolean;
}

export default function ReviewModal({ location, onClose, onSubmit, loading }: Props) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) return;
    await onSubmit(rating, comment);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40">
      <div className="bg-white w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-gray-800">Tulis Ulasan</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        <p className="text-sm text-gray-500 mb-4 truncate">{location.name}</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Star rating */}
          <div>
            <p className="text-sm text-gray-600 mb-1.5">Rating</p>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onMouseEnter={() => setHover(star)}
                  onMouseLeave={() => setHover(0)}
                  onClick={() => setRating(star)}
                >
                  <Star
                    size={28}
                    className={`transition-colors ${
                      star <= (hover || rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Comment */}
          <div>
            <p className="text-sm text-gray-600 mb-1.5">Komentar</p>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={3}
              placeholder="Bagikan pengalaman Anda..."
              className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-200 resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={rating === 0 || loading}
            className="w-full py-2.5 rounded-xl text-sm font-medium bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? "Menyimpan..." : "Kirim Ulasan"}
          </button>
        </form>
      </div>
    </div>
  );
}
