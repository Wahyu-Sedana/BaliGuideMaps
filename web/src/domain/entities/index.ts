export interface Category {
  id: number;
  name: string;
}

export interface Location {
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
}

export interface User {
  id: string;
  name: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export interface Review {
  id: number;
  user_id: string;
  location_id: string;
  rating: number;
  comment: string;
  user?: User;
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  id: string;
  name: string;
  email: string;
  token: string;
}

export interface LocationListResponse {
  data: Location[];
  limit: number;
  offset: number;
}

export interface ReviewListResponse {
  data: Review[];
  average_rating: number;
  limit: number;
  offset: number;
}

export interface CategoryListResponse {
  data: Category[];
}
