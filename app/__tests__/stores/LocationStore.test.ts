import { LocationStore } from "../src/presentation/stores/LocationStore";
import {
  GetLocationsUseCase,
  GetLocationByIdUseCase,
  GetLocationsByCategoryUseCase,
  SearchLocationsUseCase,
  GetNearbyLocationsUseCase,
  GetCategoriesUseCase,
} from "../src/domain/usecases";
import {
  ILocationRepository,
  ICategoryRepository,
} from "../src/domain/repositories";
import { Location, Category } from "../src/domain/entities";

describe("LocationStore", () => {
  let store: LocationStore;
  let mockLocationRepo: ILocationRepository;
  let mockCategoryRepo: ICategoryRepository;

  const mockLocation: Location = {
    id: "1",
    name: "Test Location",
    description: "Test Description",
    latitude: -8.6705,
    longitude: 115.2126,
    address: "Test Address",
    category_id: 1,
    category: { id: 1, name: "wisata" },
    created_at: "2024-01-01",
    updated_at: "2024-01-01",
  };

  const mockCategory: Category = {
    id: 1,
    name: "wisata",
  };

  beforeEach(() => {
    mockLocationRepo = {
      getAll: jest.fn().mockResolvedValue([mockLocation]),
      getById: jest.fn().mockResolvedValue(mockLocation),
      getByCategory: jest.fn().mockResolvedValue([mockLocation]),
      search: jest.fn().mockResolvedValue([mockLocation]),
      getNearby: jest.fn().mockResolvedValue([mockLocation]),
      create: jest.fn().mockResolvedValue(mockLocation),
      update: jest.fn().mockResolvedValue(mockLocation),
      delete: jest.fn().mockResolvedValue(undefined),
    };

    mockCategoryRepo = {
      getAll: jest.fn().mockResolvedValue([mockCategory]),
      getById: jest.fn().mockResolvedValue(mockCategory),
      create: jest.fn().mockResolvedValue(mockCategory),
      update: jest.fn().mockResolvedValue(mockCategory),
      delete: jest.fn().mockResolvedValue(undefined),
    };

    const getLocationsUseCase = new GetLocationsUseCase(mockLocationRepo);
    const getLocationByIdUseCase = new GetLocationByIdUseCase(mockLocationRepo);
    const getLocationsByCategoryUseCase = new GetLocationsByCategoryUseCase(
      mockLocationRepo,
    );
    const searchLocationsUseCase = new SearchLocationsUseCase(mockLocationRepo);
    const getNearbyLocationsUseCase = new GetNearbyLocationsUseCase(
      mockLocationRepo,
    );
    const getCategoriesUseCase = new GetCategoriesUseCase(mockCategoryRepo);

    store = new LocationStore(
      getLocationsUseCase,
      getLocationByIdUseCase,
      getLocationsByCategoryUseCase,
      searchLocationsUseCase,
      getNearbyLocationsUseCase,
      getCategoriesUseCase,
    );
  });

  it("should initialize with default values", () => {
    expect(store.locations).toEqual([]);
    expect(store.loading).toBe(false);
    expect(store.error).toBeNull();
    expect(store.selectedCategory).toBeNull();
  });

  it("should fetch locations successfully", async () => {
    await store.fetchLocations();

    expect(store.locations).toEqual([mockLocation]);
    expect(store.filteredLocations).toEqual([mockLocation]);
    expect(store.loading).toBe(false);
    expect(store.error).toBeNull();
  });

  it("should fetch categories successfully", async () => {
    await store.fetchCategories();

    expect(store.categories).toEqual([mockCategory]);
  });

  it("should handle errors during fetch", async () => {
    const error = new Error("Test error");
    (mockLocationRepo.getAll as jest.Mock).mockRejectedValueOnce(error);

    await store.fetchLocations();

    expect(store.loading).toBe(false);
    expect(store.error).toBeDefined();
  });

  it("should search locations", async () => {
    await store.searchLocations("test");

    expect(store.filteredLocations).toEqual([mockLocation]);
  });

  it("should filter by category", async () => {
    await store.selectCategory(1);

    expect(store.selectedCategory).toBe(1);
    expect(store.filteredLocations).toEqual([mockLocation]);
  });
});
