import { Location, Category, Review } from "../../domain/entities";

export class LocationModel implements Location {
  id: string;
  name: string;
  description: string;
  latitude: number;
  longitude: number;
  address: string;
  category_id: number;
  category: Category;
  reviews?: Review[];
  created_at: string;
  updated_at: string;

  constructor(data: Location) {
    this.id = data.id;
    this.name = data.name;
    this.description = data.description;
    this.latitude = data.latitude;
    this.longitude = data.longitude;
    this.address = data.address;
    this.category_id = data.category_id;
    this.category = data.category;
    this.reviews = data.reviews;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
  }

  static fromJson(json: any): LocationModel {
    return new LocationModel(json);
  }

  toJson(): any {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      latitude: this.latitude,
      longitude: this.longitude,
      address: this.address,
      category_id: this.category_id,
      category: this.category,
      reviews: this.reviews,
      created_at: this.created_at,
      updated_at: this.updated_at,
    };
  }
}

export class CategoryModel implements Category {
  id: number;
  name: string;

  constructor(data: Category) {
    this.id = data.id;
    this.name = data.name;
  }

  static fromJson(json: any): CategoryModel {
    return new CategoryModel(json);
  }

  toJson(): any {
    return {
      id: this.id,
      name: this.name,
    };
  }
}

export class ReviewModel implements Review {
  id: number;
  user_id: string;
  location_id: string;
  rating: number;
  comment: string;
  created_at: string;
  updated_at: string;

  constructor(data: Review) {
    this.id = data.id;
    this.user_id = data.user_id;
    this.location_id = data.location_id;
    this.rating = data.rating;
    this.comment = data.comment;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
  }

  static fromJson(json: any): ReviewModel {
    return new ReviewModel(json);
  }

  toJson(): any {
    return {
      id: this.id,
      user_id: this.user_id,
      location_id: this.location_id,
      rating: this.rating,
      comment: this.comment,
      created_at: this.created_at,
      updated_at: this.updated_at,
    };
  }
}
