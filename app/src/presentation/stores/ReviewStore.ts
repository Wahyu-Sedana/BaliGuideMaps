import { makeObservable, observable, action, runInAction } from "mobx";
import { Review } from "../../domain/entities";
import {
  GetReviewsForLocationUseCase,
  GetAverageRatingUseCase,
  CreateReviewUseCase,
} from "../../domain/usecases";
import { AppError } from "../../core/error/errors";

export class ReviewStore {
  reviews: Review[] = [];
  averageRating: number = 0;
  loading: boolean = false;
  error: AppError | null = null;

  constructor(
    private getReviewsForLocationUseCase: GetReviewsForLocationUseCase,
    private getAverageRatingUseCase: GetAverageRatingUseCase,
    private createReviewUseCase: CreateReviewUseCase,
  ) {
    makeObservable(this, {
      reviews: observable,
      averageRating: observable,
      loading: observable,
      error: observable,
      fetchReviews: action,
      fetchAverageRating: action,
      createReview: action,
      reset: action,
    });
  }

  async fetchReviews(
    locationId: string,
    limit: number = 10,
    offset: number = 0,
  ): Promise<void> {
    this.loading = true;
    this.error = null;
    try {
      const data = await this.getReviewsForLocationUseCase.execute(
        locationId,
        limit,
        offset,
      );
      runInAction(() => {
        this.reviews = data;
      });
    } catch (error) {
      runInAction(() => {
        this.error = error as AppError;
      });
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  }

  async fetchAverageRating(locationId: string): Promise<void> {
    this.error = null;
    try {
      const rating = await this.getAverageRatingUseCase.execute(locationId);
      runInAction(() => {
        this.averageRating = rating;
      });
    } catch (error) {
      runInAction(() => {
        this.error = error as AppError;
      });
    }
  }

  async createReview(
    userId: string,
    locationId: string,
    rating: number,
    comment: string,
  ): Promise<void> {
    this.loading = true;
    this.error = null;
    try {
      await this.createReviewUseCase.execute(
        userId,
        locationId,
        rating,
        comment,
      );
      await this.fetchReviews(locationId);
      await this.fetchAverageRating(locationId);
    } catch (error) {
      runInAction(() => {
        this.error = error as AppError;
      });
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  }

  reset(): void {
    this.reviews = [];
    this.averageRating = 0;
    this.loading = false;
    this.error = null;
  }
}
