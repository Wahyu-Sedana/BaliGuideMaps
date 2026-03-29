import { apiClient } from "@/core/api/apiClient";
import type {
  AuthResponse,
  Category,
  CategoryListResponse,
  Location,
  LocationListResponse,
  Review,
  ReviewListResponse,
} from "@/domain/entities";

// ─── Auth ────────────────────────────────────────────────────────────────────

export const authDatasource = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    const { data } = await apiClient.post<AuthResponse>("/auth/login", { email, password });
    return data;
  },

  register: async (name: string, email: string, password: string): Promise<AuthResponse> => {
    const { data } = await apiClient.post<AuthResponse>("/auth/register", { name, email, password });
    return data;
  },
};

// ─── Locations ───────────────────────────────────────────────────────────────

export const locationDatasource = {
  getAll: async (limit = 100, offset = 0): Promise<Location[]> => {
    const { data } = await apiClient.get<LocationListResponse>("/locations", {
      params: { limit, offset },
    });
    return data.data;
  },

  getById: async (id: string): Promise<Location> => {
    const { data } = await apiClient.get<Location>(`/locations/${id}`);
    return data;
  },

  search: async (q: string, limit = 20, offset = 0): Promise<Location[]> => {
    const { data } = await apiClient.get<LocationListResponse>("/locations/search", {
      params: { q, limit, offset },
    });
    return data.data;
  },

  getNearby: async (lat: number, lon: number, radius = 5000): Promise<Location[]> => {
    const { data } = await apiClient.get<LocationListResponse>("/locations/nearby", {
      params: { lat, lon, radius },
    });
    return data.data;
  },

  getByCategory: async (categoryId: number, limit = 100, offset = 0): Promise<Location[]> => {
    const { data } = await apiClient.get<LocationListResponse>(`/categories/${categoryId}/locations`, {
      params: { limit, offset },
    });
    return data.data;
  },
};

// ─── Categories ──────────────────────────────────────────────────────────────

export const categoryDatasource = {
  getAll: async (): Promise<Category[]> => {
    const { data } = await apiClient.get<CategoryListResponse>("/categories");
    return data.data;
  },
};

// ─── Reviews ─────────────────────────────────────────────────────────────────

export const reviewDatasource = {
  getByLocation: async (locationId: string, limit = 20, offset = 0): Promise<ReviewListResponse> => {
    const { data } = await apiClient.get<ReviewListResponse>(`/locations/${locationId}/reviews`, {
      params: { limit, offset },
    });
    return data;
  },

  getAverageRating: async (locationId: string): Promise<number> => {
    const { data } = await apiClient.get<{ average_rating: number }>(
      `/locations/${locationId}/reviews/rating`,
    );
    return data.average_rating;
  },

  create: async (
    userId: string,
    locationId: string,
    rating: number,
    comment: string,
  ): Promise<Review> => {
    const { data } = await apiClient.post<Review>("/reviews", {
      user_id: userId,
      location_id: locationId,
      rating,
      comment,
    });
    return data;
  },
};
