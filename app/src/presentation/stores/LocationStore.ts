import {
  makeObservable,
  observable,
  action,
  computed,
  runInAction,
} from "mobx";
import { Location, Category } from "../../domain/entities";
import {
  GetLocationsUseCase,
  GetLocationByIdUseCase,
  GetLocationsByCategoryUseCase,
  SearchLocationsUseCase,
  GetNearbyLocationsUseCase,
  GetCategoriesUseCase,
} from "../../domain/usecases";
import { AppError } from "../../core/error/errors";

export class LocationStore {
  locations: Location[] = [];
  filteredLocations: Location[] = [];
  selectedLocation: Location | null = null;
  categories: Category[] = [];
  selectedCategory: number | null = null;
  loading: boolean = false;
  error: AppError | null = null;
  searchKeyword: string = "";

  constructor(
    private getLocationsUseCase: GetLocationsUseCase,
    private getLocationByIdUseCase: GetLocationByIdUseCase,
    private getLocationsByCategoryUseCase: GetLocationsByCategoryUseCase,
    private searchLocationsUseCase: SearchLocationsUseCase,
    private getNearbyLocationsUseCase: GetNearbyLocationsUseCase,
    private getCategoriesUseCase: GetCategoriesUseCase,
  ) {
    makeObservable(this, {
      locations: observable,
      filteredLocations: observable,
      selectedLocation: observable,
      categories: observable,
      selectedCategory: observable,
      loading: observable,
      error: observable,
      searchKeyword: observable,
      fetchLocations: action,
      fetchLocationById: action,
      fetchLocationsByCategory: action,
      searchLocations: action,
      fetchNearbyLocations: action,
      fetchCategories: action,
      selectCategory: action,
      selectLocation: action,
      clearSelection: action,
      setSearchKeyword: action,
      getFilteredLocations: computed,
    });
  }

  async fetchLocations(limit: number = 20, offset: number = 0): Promise<void> {
    this.loading = true;
    this.error = null;
    try {
      const data = await this.getLocationsUseCase.execute(limit, offset);
      runInAction(() => {
        this.locations = data;
        this.filteredLocations = data;
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

  async fetchLocationById(id: string): Promise<void> {
    this.loading = true;
    this.error = null;
    try {
      const data = await this.getLocationByIdUseCase.execute(id);
      runInAction(() => {
        this.selectedLocation = data;
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

  async fetchLocationsByCategory(
    categoryId: number,
    limit: number = 20,
    offset: number = 0,
  ): Promise<void> {
    this.loading = true;
    this.error = null;
    try {
      const data = await this.getLocationsByCategoryUseCase.execute(
        categoryId,
        limit,
        offset,
      );
      runInAction(() => {
        this.filteredLocations = data;
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

  async searchLocations(
    keyword: string,
    limit: number = 20,
    offset: number = 0,
  ): Promise<void> {
    this.loading = true;
    this.error = null;
    this.searchKeyword = keyword;
    try {
      const data = await this.searchLocationsUseCase.execute(
        keyword,
        limit,
        offset,
      );
      runInAction(() => {
        this.filteredLocations = data;
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

  async fetchNearbyLocations(
    latitude: number,
    longitude: number,
    radius: number = 5,
  ): Promise<void> {
    this.loading = true;
    this.error = null;
    try {
      const data = await this.getNearbyLocationsUseCase.execute(
        latitude,
        longitude,
        radius,
      );
      runInAction(() => {
        this.filteredLocations = data;
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

  async fetchCategories(limit: number = 10, offset: number = 0): Promise<void> {
    this.error = null;
    try {
      const data = await this.getCategoriesUseCase.execute(limit, offset);
      runInAction(() => {
        this.categories = data;
      });
    } catch (error) {
      runInAction(() => {
        this.error = error as AppError;
      });
    }
  }

  selectCategory(categoryId: number | null): void {
    this.selectedCategory = categoryId;
    if (categoryId) {
      this.fetchLocationsByCategory(categoryId);
    } else {
      this.filteredLocations = this.locations;
    }
  }

  selectLocation(location: Location): void {
    this.selectedLocation = location;
  }

  clearSelection(): void {
    this.selectedLocation = null;
    this.selectedCategory = null;
    this.searchKeyword = "";
    this.filteredLocations = this.locations;
  }

  setSearchKeyword(keyword: string): void {
    this.searchKeyword = keyword;
  }

  get getFilteredLocations(): Location[] {
    return this.filteredLocations;
  }
}
