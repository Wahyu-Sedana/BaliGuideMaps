import { Location, Category, Review } from "../entities";

export interface ILocationRepository {
  getAll(limit: number, offset: number): Promise<Location[]>;
  getById(id: string): Promise<Location>;
  getByCategory(
    categoryId: number,
    limit: number,
    offset: number,
  ): Promise<Location[]>;
  search(keyword: string, limit: number, offset: number): Promise<Location[]>;
  getNearby(
    latitude: number,
    longitude: number,
    radius: number,
  ): Promise<Location[]>;
  create(
    location: Omit<Location, "id" | "created_at" | "updated_at">,
  ): Promise<Location>;
  update(id: string, location: Partial<Location>): Promise<Location>;
  delete(id: string): Promise<void>;
}

export interface ICategoryRepository {
  getAll(limit: number, offset: number): Promise<Category[]>;
  getById(id: number): Promise<Category>;
  create(name: string): Promise<Category>;
  update(id: number, name: string): Promise<Category>;
  delete(id: number): Promise<void>;
}

export interface IReviewRepository {
  getByLocation(
    locationId: string,
    limit: number,
    offset: number,
  ): Promise<Review[]>;
  getByUser(userId: string, limit: number, offset: number): Promise<Review[]>;
  getById(id: number): Promise<Review>;
  create(
    userId: string,
    locationId: string,
    rating: number,
    comment: string,
  ): Promise<Review>;
  update(id: number, rating: number, comment: string): Promise<Review>;
  delete(id: number): Promise<void>;
  getAverageRating(locationId: string): Promise<number>;
}
