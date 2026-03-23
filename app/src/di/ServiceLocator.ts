import {
  LocationRemoteDataSource,
  CategoryRemoteDataSource,
  ReviewRemoteDataSource,
} from "../data/datasources";
import {
  LocationRepository,
  CategoryRepository,
  ReviewRepository,
} from "../data/repositories";
import {
  GetLocationsUseCase,
  GetLocationByIdUseCase,
  GetLocationsByCategoryUseCase,
  SearchLocationsUseCase,
  GetNearbyLocationsUseCase,
  GetCategoriesUseCase,
  GetReviewsForLocationUseCase,
  GetAverageRatingUseCase,
  CreateReviewUseCase,
} from "../domain/usecases";
import { LocationStore } from "../presentation/stores/LocationStore";
import { ReviewStore } from "../presentation/stores/ReviewStore";
import { AuthStore } from "../presentation/stores/AuthStore";

class ServiceLocator {
  private static instance: ServiceLocator;

  private locationRemoteDataSource: LocationRemoteDataSource;
  private categoryRemoteDataSource: CategoryRemoteDataSource;
  private reviewRemoteDataSource: ReviewRemoteDataSource;

  private locationRepository: LocationRepository;
  private categoryRepository: CategoryRepository;
  private reviewRepository: ReviewRepository;

  private getLocationsUseCase: GetLocationsUseCase;
  private getLocationByIdUseCase: GetLocationByIdUseCase;
  private getLocationsByCategoryUseCase: GetLocationsByCategoryUseCase;
  private searchLocationsUseCase: SearchLocationsUseCase;
  private getNearbyLocationsUseCase: GetNearbyLocationsUseCase;
  private getCategoriesUseCase: GetCategoriesUseCase;
  private getReviewsForLocationUseCase: GetReviewsForLocationUseCase;
  private getAverageRatingUseCase: GetAverageRatingUseCase;
  private createReviewUseCase: CreateReviewUseCase;

  private locationStore: LocationStore;
  private reviewStore: ReviewStore;
  private authStore: AuthStore;

  private constructor() {
    // Data sources
    this.locationRemoteDataSource = new LocationRemoteDataSource();
    this.categoryRemoteDataSource = new CategoryRemoteDataSource();
    this.reviewRemoteDataSource = new ReviewRemoteDataSource();

    // Repositories
    this.locationRepository = new LocationRepository(
      this.locationRemoteDataSource,
    );
    this.categoryRepository = new CategoryRepository(
      this.categoryRemoteDataSource,
    );
    this.reviewRepository = new ReviewRepository(this.reviewRemoteDataSource);

    // Use cases
    this.getLocationsUseCase = new GetLocationsUseCase(this.locationRepository);
    this.getLocationByIdUseCase = new GetLocationByIdUseCase(
      this.locationRepository,
    );
    this.getLocationsByCategoryUseCase = new GetLocationsByCategoryUseCase(
      this.locationRepository,
    );
    this.searchLocationsUseCase = new SearchLocationsUseCase(
      this.locationRepository,
    );
    this.getNearbyLocationsUseCase = new GetNearbyLocationsUseCase(
      this.locationRepository,
    );
    this.getCategoriesUseCase = new GetCategoriesUseCase(
      this.categoryRepository,
    );
    this.getReviewsForLocationUseCase = new GetReviewsForLocationUseCase(
      this.reviewRepository,
    );
    this.getAverageRatingUseCase = new GetAverageRatingUseCase(
      this.reviewRepository,
    );
    this.createReviewUseCase = new CreateReviewUseCase(this.reviewRepository);

    this.authStore = new AuthStore();

    // Stores
    this.locationStore = new LocationStore(
      this.getLocationsUseCase,
      this.getLocationByIdUseCase,
      this.getLocationsByCategoryUseCase,
      this.searchLocationsUseCase,
      this.getNearbyLocationsUseCase,
      this.getCategoriesUseCase,
    );
    this.reviewStore = new ReviewStore(
      this.getReviewsForLocationUseCase,
      this.getAverageRatingUseCase,
      this.createReviewUseCase,
    );
  }

  public static getInstance(): ServiceLocator {
    if (!ServiceLocator.instance) {
      ServiceLocator.instance = new ServiceLocator();
    }
    return ServiceLocator.instance;
  }

  public getLocationStore(): LocationStore {
    return this.locationStore;
  }

  public getReviewStore(): ReviewStore {
    return this.reviewStore;
  }

  public getAuthStore(): AuthStore {
    return this.authStore;
  }
}

export default ServiceLocator.getInstance();
