import {
  GetLocationsUseCase,
  SearchLocationsUseCase,
  GetNearbyLocationsUseCase,
  GetLocationsByCategoryUseCase,
} from "../src/domain/usecases";
import { ILocationRepository } from "../src/domain/repositories";
import { Location } from "../src/domain/entities";

const mockLocation: Location = {
  id: "1",
  name: "Tanah Lot",
  description: "Temple on the rock",
  latitude: -8.6271,
  longitude: 115.427,
  address: "Bali",
  categoryId: "1",
  category: { id: "1", name: "wisata" },
  reviews: [],
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockLocationRepository: ILocationRepository = {
  getAll: jest.fn(),
  getById: jest.fn(),
  searchByKeyword: jest.fn(),
  getNearby: jest.fn(),
  getByCategory: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

describe("GetLocationsUseCase", () => {
  it("should return all locations", async () => {
    const mockLocations = [mockLocation];
    (mockLocationRepository.getAll as jest.Mock).mockResolvedValue(
      mockLocations,
    );

    const useCase = new GetLocationsUseCase(mockLocationRepository);
    const result = await useCase.execute();

    expect(result).toEqual(mockLocations);
    expect(mockLocationRepository.getAll).toHaveBeenCalled();
  });

  it("should throw error on API failure", async () => {
    const error = new Error("API Error");
    (mockLocationRepository.getAll as jest.Mock).mockRejectedValue(error);

    const useCase = new GetLocationsUseCase(mockLocationRepository);

    await expect(useCase.execute()).rejects.toThrow("API Error");
  });
});

describe("SearchLocationsUseCase", () => {
  it("should search locations by keyword", async () => {
    const mockResults = [mockLocation];
    (mockLocationRepository.searchByKeyword as jest.Mock).mockResolvedValue(
      mockResults,
    );

    const useCase = new SearchLocationsUseCase(mockLocationRepository);
    const result = await useCase.execute("Tanah");

    expect(result).toEqual(mockResults);
    expect(mockLocationRepository.searchByKeyword).toHaveBeenCalledWith(
      "Tanah",
    );
  });

  it("should return empty array when no match", async () => {
    (mockLocationRepository.searchByKeyword as jest.Mock).mockResolvedValue([]);

    const useCase = new SearchLocationsUseCase(mockLocationRepository);
    const result = await useCase.execute("NonExistent");

    expect(result).toEqual([]);
  });

  it("should throw error on empty keyword", async () => {
    const useCase = new SearchLocationsUseCase(mockLocationRepository);

    await expect(useCase.execute("")).rejects.toThrow(
      "Keyword cannot be empty",
    );
  });
});

describe("GetNearbyLocationsUseCase", () => {
  it("should find nearby locations", async () => {
    const mockNearby = [mockLocation];
    (mockLocationRepository.getNearby as jest.Mock).mockResolvedValue(
      mockNearby,
    );

    const useCase = new GetNearbyLocationsUseCase(mockLocationRepository);
    const result = await useCase.execute(-8.6271, 115.427, 5);

    expect(result).toEqual(mockNearby);
    expect(mockLocationRepository.getNearby).toHaveBeenCalledWith(
      -8.6271,
      115.427,
      5,
    );
  });

  it("should validate latitude", async () => {
    const useCase = new GetNearbyLocationsUseCase(mockLocationRepository);

    await expect(useCase.execute(100, 115.427, 5)).rejects.toThrow(
      "Invalid latitude",
    );
  });

  it("should validate longitude", async () => {
    const useCase = new GetNearbyLocationsUseCase(mockLocationRepository);

    await expect(useCase.execute(-8.6271, 200, 5)).rejects.toThrow(
      "Invalid longitude",
    );
  });

  it("should validate radius", async () => {
    const useCase = new GetNearbyLocationsUseCase(mockLocationRepository);

    await expect(useCase.execute(-8.6271, 115.427, 0)).rejects.toThrow(
      "Radius must be greater than 0",
    );
  });
});

describe("GetLocationsByCategoryUseCase", () => {
  it("should get locations by category", async () => {
    const mockResults = [mockLocation];
    (mockLocationRepository.getByCategory as jest.Mock).mockResolvedValue(
      mockResults,
    );

    const useCase = new GetLocationsByCategoryUseCase(mockLocationRepository);
    const result = await useCase.execute("1");

    expect(result).toEqual(mockResults);
    expect(mockLocationRepository.getByCategory).toHaveBeenCalledWith("1");
  });

  it("should throw error on empty category ID", async () => {
    const useCase = new GetLocationsByCategoryUseCase(mockLocationRepository);

    await expect(useCase.execute("")).rejects.toThrow(
      "Category ID cannot be empty",
    );
  });
});
