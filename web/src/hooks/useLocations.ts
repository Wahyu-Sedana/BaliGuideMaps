"use client";

import { useQuery } from "@tanstack/react-query";
import { locationDatasource, categoryDatasource } from "@/data/datasources";

export function useLocations(limit = 100) {
  return useQuery({
    queryKey: ["locations", limit],
    queryFn: () => locationDatasource.getAll(limit),
    staleTime: 5 * 60 * 1000,
  });
}

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: () => categoryDatasource.getAll(),
    staleTime: 10 * 60 * 1000,
  });
}

export function useSearchLocations(query: string) {
  return useQuery({
    queryKey: ["locations", "search", query],
    queryFn: () => locationDatasource.search(query),
    enabled: query.length > 2,
    staleTime: 60 * 1000,
  });
}
