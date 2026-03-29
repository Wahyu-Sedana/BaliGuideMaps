"use client";

import { create } from "zustand";
import type { Review } from "@/domain/entities";

interface ReviewState {
  reviews: Review[];
  averageRating: number;
  loading: boolean;
  error: string | null;

  setReviews: (reviews: Review[], averageRating: number) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

export const useReviewStore = create<ReviewState>()((set) => ({
  reviews: [],
  averageRating: 0,
  loading: false,
  error: null,

  setReviews: (reviews, averageRating) => set({ reviews, averageRating }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  reset: () => set({ reviews: [], averageRating: 0, error: null }),
}));
