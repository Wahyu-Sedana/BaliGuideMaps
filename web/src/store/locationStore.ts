"use client";

import { create } from "zustand";
import type { Category, Location } from "@/domain/entities";

interface LocationState {
  locations: Location[];
  categories: Category[];
  selectedLocation: Location | null;
  selectedCategory: number | null;
  searchKeyword: string;
  isSatellite: boolean;
  showHeatmap: boolean;

  setLocations: (locations: Location[]) => void;
  setCategories: (categories: Category[]) => void;
  selectLocation: (location: Location | null) => void;
  selectCategory: (categoryId: number | null) => void;
  setSearchKeyword: (keyword: string) => void;
  toggleSatellite: () => void;
  toggleHeatmap: () => void;

  getFilteredLocations: (locations: Location[]) => Location[];
}

export const useLocationStore = create<LocationState>()((set, get) => ({
  locations: [],
  categories: [],
  selectedLocation: null,
  selectedCategory: null,
  searchKeyword: "",
  isSatellite: false,
  showHeatmap: false,

  setLocations: (locations) => set({ locations }),
  setCategories: (categories) => set({ categories }),
  selectLocation: (location) => set({ selectedLocation: location }),
  selectCategory: (categoryId) => set({ selectedCategory: categoryId }),
  setSearchKeyword: (keyword) => set({ searchKeyword: keyword }),
  toggleSatellite: () => set((s) => ({ isSatellite: !s.isSatellite })),
  toggleHeatmap: () => set((s) => ({ showHeatmap: !s.showHeatmap })),

  getFilteredLocations: (locations) => {
    const { selectedCategory, searchKeyword } = get();
    let filtered = locations;

    if (selectedCategory !== null) {
      filtered = filtered.filter((l) => l.category_id === selectedCategory);
    }

    if (searchKeyword.trim()) {
      const kw = searchKeyword.toLowerCase();
      filtered = filtered.filter(
        (l) =>
          l.name.toLowerCase().includes(kw) ||
          l.description?.toLowerCase().includes(kw) ||
          l.address?.toLowerCase().includes(kw),
      );
    }

    return filtered;
  },
}));
