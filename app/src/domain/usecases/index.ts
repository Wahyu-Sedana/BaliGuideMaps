import { Location, Category, Review } from "../entities";
import {
  ILocationRepository,
  ICategoryRepository,
  IReviewRepository,
} from "../repositories";

export class GetLocationsUseCase {
  constructor(private locationRepository: ILocationRepository) {}

  async execute(limit: number = 20, offset: number = 0): Promise<Location[]> {
    return this.locationRepository.getAll(limit, offset);
  }
}

export class GetLocationByIdUseCase {
  constructor(private locationRepository: ILocationRepository) {}

  async execute(id: string): Promise<Location> {
    return this.locationRepository.getById(id);
  }
}

export class GetLocationsByCategoryUseCase {
  constructor(private locationRepository: ILocationRepository) {}

  async execute(
    categoryId: number,
    limit: number = 20,
    offset: number = 0,
  ): Promise<Location[]> {
    return this.locationRepository.getByCategory(categoryId, limit, offset);
  }
}

export class SearchLocationsUseCase {
  constructor(private locationRepository: ILocationRepository) {}

  async execute(
    keyword: string,
    limit: number = 20,
    offset: number = 0,
  ): Promise<Location[]> {
    if (!keyword?.trim()) {
      throw new Error("Search keyword is required");
    }
    return this.locationRepository.search(keyword, limit, offset);
  }
}

export class GetNearbyLocationsUseCase {
  constructor(private locationRepository: ILocationRepository) {}

  async execute(
    latitude: number,
    longitude: number,
    radius: number = 5,
  ): Promise<Location[]> {
    if (latitude < -90 || latitude > 90) {
      throw new Error("Invalid latitude");
    }
    if (longitude < -180 || longitude > 180) {
      throw new Error("Invalid longitude");
    }
    if (radius <= 0) {
      throw new Error("Radius must be greater than 0");
    }
    return this.locationRepository.getNearby(latitude, longitude, radius);
  }
}

export class GetCategoriesUseCase {
  constructor(private categoryRepository: ICategoryRepository) {}

  async execute(limit: number = 10, offset: number = 0): Promise<Category[]> {
    return this.categoryRepository.getAll(limit, offset);
  }
}

export class GetReviewsForLocationUseCase {
  constructor(private reviewRepository: IReviewRepository) {}

  async execute(
    locationId: string,
    limit: number = 10,
    offset: number = 0,
  ): Promise<Review[]> {
    return this.reviewRepository.getByLocation(locationId, limit, offset);
  }
}

export class GetAverageRatingUseCase {
  constructor(private reviewRepository: IReviewRepository) {}

  async execute(locationId: string): Promise<number> {
    return this.reviewRepository.getAverageRating(locationId);
  }
}

export class CreateReviewUseCase {
  constructor(private reviewRepository: IReviewRepository) {}

  async execute(
    userId: string,
    locationId: string,
    rating: number,
    comment: string,
  ): Promise<Review> {
    if (rating < 1 || rating > 5) {
      throw new Error("Rating must be between 1 and 5");
    }
    return this.reviewRepository.create(userId, locationId, rating, comment);
  }
}
