import { LocationRepository } from "../src/data/repositories";
import { LocationRemoteDataSource } from "../src/data/datasources";
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

describe("LocationRepository", () => {
  let repository: LocationRepository;
  let mockDataSource: LocationRemoteDataSource;

  beforeEach(() => {
    mockDataSource = {
      getAll: jest.fn(),
      getById: jest.fn(),
      searchByKeyword: jest.fn(),
      getNearby: jest.fn(),
      getByCategory: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as unknown as LocationRemoteDataSource;

    repository = new LocationRepository(mockDataSource);
  });

  describe("getAll", () => {
    it("should return all locations", async () => {
      const mockLocations = [mockLocation];
      (mockDataSource.getAll as jest.Mock).mockResolvedValue(mockLocations);

      const result = await repository.getAll();

      expect(result).toEqual(mockLocations);
      expect(mockDataSource.getAll).toHaveBeenCalled();
    });

    it("should handle API error", async () => {
      const error = new Error("API Error");
      (mockDataSource.getAll as jest.Mock).mockRejectedValue(error);

      await expect(repository.getAll()).rejects.toThrow("API Error");
    });

    it("should return empty array on 404", async () => {
      const error = new Error("Not Found");
      (error as any).status = 404;
      (mockDataSource.getAll as jest.Mock).mockRejectedValue(error);

      await expect(repository.getAll()).rejects.toThrow();
    });
  });

  describe("getById", () => {
    it("should return location by ID", async () => {
      (mockDataSource.getById as jest.Mock).mockResolvedValue(mockLocation);

      const result = await repository.getById("1");

      expect(result).toEqual(mockLocation);
      expect(mockDataSource.getById).toHaveBeenCalledWith("1");
    });

    it("should throw on invalid ID", async () => {
      const error = new Error("Not Found");
      (error as any).status = 404;
      (mockDataSource.getById as jest.Mock).mockRejectedValue(error);

      await expect(repository.getById("invalid")).rejects.toThrow();
    });
  });

  describe("searchByKeyword", () => {
    it("should search locations", async () => {
      const results = [mockLocation];
      (mockDataSource.searchByKeyword as jest.Mock).mockResolvedValue(results);

      const result = await repository.searchByKeyword("Tanah");

      expect(result).toEqual(results);
      expect(mockDataSource.searchByKeyword).toHaveBeenCalledWith("Tanah");
    });

    it("should return empty array on no match", async () => {
      (mockDataSource.searchByKeyword as jest.Mock).mockResolvedValue([]);

      const result = await repository.searchByKeyword("NonExistent");

      expect(result).toEqual([]);
    });
  });

  describe("getNearby", () => {
    it("should get nearby locations", async () => {
      const results = [mockLocation];
      (mockDataSource.getNearby as jest.Mock).mockResolvedValue(results);

      const result = await repository.getNearby(-8.6271, 115.427, 5);

      expect(result).toEqual(results);
      expect(mockDataSource.getNearby).toHaveBeenCalledWith(
        -8.6271,
        115.427,
        5,
      );
    });
  });

  describe("getByCategory", () => {
    it("should get locations by category", async () => {
      const results = [mockLocation];
      (mockDataSource.getByCategory as jest.Mock).mockResolvedValue(results);

      const result = await repository.getByCategory("1");

      expect(result).toEqual(results);
      expect(mockDataSource.getByCategory).toHaveBeenCalledWith("1");
    });
  });
});
