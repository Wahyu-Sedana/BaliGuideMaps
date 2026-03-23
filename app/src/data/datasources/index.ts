import apiClient from "../../core/api/apiClient";
import {
  Location,
  Category,
  Review,
  LocationResponse,
} from "../../domain/entities";
import { LocationModel, CategoryModel, ReviewModel } from "../models";

export class LocationRemoteDataSource {
  async getAll(limit: number, offset: number): Promise<Location[]> {
    const response = await apiClient.get<LocationResponse>("/locations", {
      limit,
      offset,
    });
    return response.data.map((item) => LocationModel.fromJson(item));
  }

  async getById(id: string): Promise<Location> {
    const data = await apiClient.get<Location>(`/locations/${id}`);
    return LocationModel.fromJson(data);
  }

  async getByCategory(
    categoryId: number,
    limit: number,
    offset: number,
  ): Promise<Location[]> {
    const response = await apiClient.get<LocationResponse>(
      `/categories/${categoryId}/locations`,
      {
        limit,
        offset,
      },
    );
    return response.data.map((item) => LocationModel.fromJson(item));
  }

  async search(
    keyword: string,
    limit: number,
    offset: number,
  ): Promise<Location[]> {
    const response = await apiClient.get<LocationResponse>(
      "/locations/search",
      {
        q: keyword,
        limit,
        offset,
      },
    );
    return response.data.map((item) => LocationModel.fromJson(item));
  }

  async getNearby(
    latitude: number,
    longitude: number,
    radius: number,
  ): Promise<Location[]> {
    const response = await apiClient.get<LocationResponse>(
      "/locations/nearby",
      {
        lat: latitude,
        lon: longitude,
        radius,
      },
    );
    return response.data.map((item) => LocationModel.fromJson(item));
  }

  async create(
    location: Omit<Location, "id" | "created_at" | "updated_at">,
  ): Promise<Location> {
    const data = await apiClient.post<Location>("/locations", location);
    return LocationModel.fromJson(data);
  }

  async update(id: string, location: Partial<Location>): Promise<Location> {
    const data = await apiClient.put<Location>(`/locations/${id}`, location);
    return LocationModel.fromJson(data);
  }

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/locations/${id}`);
  }
}

export class CategoryRemoteDataSource {
  async getAll(limit: number, offset: number): Promise<Category[]> {
    const response = await apiClient.get<any>("/categories", { limit, offset });
    return response.data.map((item: any) => CategoryModel.fromJson(item));
  }

  async getById(id: number): Promise<Category> {
    const data = await apiClient.get<Category>(`/categories/${id}`);
    return CategoryModel.fromJson(data);
  }

  async create(name: string): Promise<Category> {
    const data = await apiClient.post<Category>("/categories", { name });
    return CategoryModel.fromJson(data);
  }

  async update(id: number, name: string): Promise<Category> {
    const data = await apiClient.put<Category>(`/categories/${id}`, { name });
    return CategoryModel.fromJson(data);
  }

  async delete(id: number): Promise<void> {
    await apiClient.delete(`/categories/${id}`);
  }
}

export class ReviewRemoteDataSource {
  async getByLocation(
    locationId: string,
    limit: number,
    offset: number,
  ): Promise<Review[]> {
    const response = await apiClient.get<any>(
      `/locations/${locationId}/reviews`,
      {
        limit,
        offset,
      },
    );
    return response.data.map((item: any) => ReviewModel.fromJson(item));
  }

  async getByUser(
    userId: string,
    limit: number,
    offset: number,
  ): Promise<Review[]> {
    const response = await apiClient.get<any>(`/users/${userId}/reviews`, {
      limit,
      offset,
    });
    return response.data.map((item: any) => ReviewModel.fromJson(item));
  }

  async getById(id: number): Promise<Review> {
    const data = await apiClient.get<Review>(`/reviews/${id}`);
    return ReviewModel.fromJson(data);
  }

  async create(
    userId: string,
    locationId: string,
    rating: number,
    comment: string,
  ): Promise<Review> {
    const data = await apiClient.post<Review>("/reviews", {
      location_id: locationId,
      rating,
      comment,
    });
    return ReviewModel.fromJson(data);
  }

  async update(id: number, rating: number, comment: string): Promise<Review> {
    const data = await apiClient.put<Review>(`/reviews/${id}`, {
      rating,
      comment,
    });
    return ReviewModel.fromJson(data);
  }

  async delete(id: number): Promise<void> {
    await apiClient.delete(`/reviews/${id}`);
  }

  async getAverageRating(locationId: string): Promise<number> {
    const response = await apiClient.get<any>(
      `/locations/${locationId}/reviews/rating`,
    );
    return response.average_rating || 0;
  }
}
