import {
  ILocationRepository,
  ICategoryRepository,
  IReviewRepository,
} from "../../domain/repositories";
import { Location, Category, Review } from "../../domain/entities";
import {
  LocationRemoteDataSource,
  CategoryRemoteDataSource,
  ReviewRemoteDataSource,
} from "../datasources";
import { handleError } from "../../core/error/errors";

export class LocationRepository implements ILocationRepository {
  constructor(private remoteDataSource: LocationRemoteDataSource) {}

  async getAll(limit: number, offset: number): Promise<Location[]> {
    try {
      return await this.remoteDataSource.getAll(limit, offset);
    } catch (error) {
      throw handleError(error);
    }
  }

  async getById(id: string): Promise<Location> {
    try {
      return await this.remoteDataSource.getById(id);
    } catch (error) {
      throw handleError(error);
    }
  }

  async getByCategory(
    categoryId: number,
    limit: number,
    offset: number,
  ): Promise<Location[]> {
    try {
      return await this.remoteDataSource.getByCategory(
        categoryId,
        limit,
        offset,
      );
    } catch (error) {
      throw handleError(error);
    }
  }

  async search(
    keyword: string,
    limit: number,
    offset: number,
  ): Promise<Location[]> {
    try {
      return await this.remoteDataSource.search(keyword, limit, offset);
    } catch (error) {
      throw handleError(error);
    }
  }

  async getNearby(
    latitude: number,
    longitude: number,
    radius: number,
  ): Promise<Location[]> {
    try {
      return await this.remoteDataSource.getNearby(latitude, longitude, radius);
    } catch (error) {
      throw handleError(error);
    }
  }

  async create(
    location: Omit<Location, "id" | "created_at" | "updated_at">,
  ): Promise<Location> {
    try {
      return await this.remoteDataSource.create(location);
    } catch (error) {
      throw handleError(error);
    }
  }

  async update(id: string, location: Partial<Location>): Promise<Location> {
    try {
      return await this.remoteDataSource.update(id, location);
    } catch (error) {
      throw handleError(error);
    }
  }

  async delete(id: string): Promise<void> {
    try {
      return await this.remoteDataSource.delete(id);
    } catch (error) {
      throw handleError(error);
    }
  }
}

export class CategoryRepository implements ICategoryRepository {
  constructor(private remoteDataSource: CategoryRemoteDataSource) {}

  async getAll(limit: number, offset: number): Promise<Category[]> {
    try {
      return await this.remoteDataSource.getAll(limit, offset);
    } catch (error) {
      throw handleError(error);
    }
  }

  async getById(id: number): Promise<Category> {
    try {
      return await this.remoteDataSource.getById(id);
    } catch (error) {
      throw handleError(error);
    }
  }

  async create(name: string): Promise<Category> {
    try {
      return await this.remoteDataSource.create(name);
    } catch (error) {
      throw handleError(error);
    }
  }

  async update(id: number, name: string): Promise<Category> {
    try {
      return await this.remoteDataSource.update(id, name);
    } catch (error) {
      throw handleError(error);
    }
  }

  async delete(id: number): Promise<void> {
    try {
      return await this.remoteDataSource.delete(id);
    } catch (error) {
      throw handleError(error);
    }
  }
}

export class ReviewRepository implements IReviewRepository {
  constructor(private remoteDataSource: ReviewRemoteDataSource) {}

  async getByLocation(
    locationId: string,
    limit: number,
    offset: number,
  ): Promise<Review[]> {
    try {
      return await this.remoteDataSource.getByLocation(
        locationId,
        limit,
        offset,
      );
    } catch (error) {
      throw handleError(error);
    }
  }

  async getByUser(
    userId: string,
    limit: number,
    offset: number,
  ): Promise<Review[]> {
    try {
      return await this.remoteDataSource.getByUser(userId, limit, offset);
    } catch (error) {
      throw handleError(error);
    }
  }

  async getById(id: number): Promise<Review> {
    try {
      return await this.remoteDataSource.getById(id);
    } catch (error) {
      throw handleError(error);
    }
  }

  async create(
    userId: string,
    locationId: string,
    rating: number,
    comment: string,
  ): Promise<Review> {
    try {
      return await this.remoteDataSource.create(
        userId,
        locationId,
        rating,
        comment,
      );
    } catch (error) {
      throw handleError(error);
    }
  }

  async update(id: number, rating: number, comment: string): Promise<Review> {
    try {
      return await this.remoteDataSource.update(id, rating, comment);
    } catch (error) {
      throw handleError(error);
    }
  }

  async delete(id: number): Promise<void> {
    try {
      return await this.remoteDataSource.delete(id);
    } catch (error) {
      throw handleError(error);
    }
  }

  async getAverageRating(locationId: string): Promise<number> {
    try {
      return await this.remoteDataSource.getAverageRating(locationId);
    } catch (error) {
      throw handleError(error);
    }
  }
}
