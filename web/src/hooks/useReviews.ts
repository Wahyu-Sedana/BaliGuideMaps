"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { reviewDatasource } from "@/data/datasources";

export function useReviews(locationId: string | null) {
  return useQuery({
    queryKey: ["reviews", locationId],
    queryFn: () => reviewDatasource.getByLocation(locationId!),
    enabled: !!locationId,
    staleTime: 60 * 1000,
  });
}

export function useCreateReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      userId,
      locationId,
      rating,
      comment,
    }: {
      userId: string;
      locationId: string;
      rating: number;
      comment: string;
    }) => reviewDatasource.create(userId, locationId, rating, comment),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["reviews", variables.locationId] });
    },
  });
}
