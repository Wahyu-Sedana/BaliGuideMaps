import { ReviewStore } from "../src/presentation/stores";
import { IReviewRepository } from "../src/domain/repositories";
import { Review } from "../src/domain/entities";

const mockReview: Review = {
  id: "1",
  userId: "user1",
  locationId: "loc1",
  rating: 5,
  comment: "Great place!",
  user: { id: "user1", name: "John Doe", email: "john@example.com" },
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe("ReviewStore", () => {
  let store: ReviewStore;
  let mockReviewRepository: IReviewRepository;

  beforeEach(() => {
    mockReviewRepository = {
      getByLocation: jest.fn(),
      getAverageRating: jest.fn(),
      create: jest.fn(),
      getByUser: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      getById: jest.fn(),
    };

    store = new ReviewStore(mockReviewRepository);
  });

  describe("initialization", () => {
    it("should initialize with default values", () => {
      expect(store.reviews).toEqual([]);
      expect(store.averageRating).toBe(0);
      expect(store.loading).toBe(false);
      expect(store.error).toBeNull();
    });
  });

  describe("fetchReviews", () => {
    it("should fetch reviews for location", async () => {
      const mockReviews = [mockReview];
      (mockReviewRepository.getByLocation as jest.Mock).mockResolvedValue(
        mockReviews,
      );

      await store.fetchReviews("loc1");

      expect(store.reviews).toEqual(mockReviews);
      expect(store.loading).toBe(false);
      expect(store.error).toBeNull();
    });

    it("should set loading state during fetch", async () => {
      (mockReviewRepository.getByLocation as jest.Mock).mockImplementation(
        () => new Promise((resolve) => setTimeout(() => resolve([]), 100)),
      );

      const promise = store.fetchReviews("loc1");
      expect(store.loading).toBe(true);

      await promise;
      expect(store.loading).toBe(false);
    });

    it("should handle fetch error", async () => {
      const error = new Error("API Error");
      (mockReviewRepository.getByLocation as jest.Mock).mockRejectedValue(
        error,
      );

      await store.fetchReviews("loc1");

      expect(store.error).toBeDefined();
      expect(store.loading).toBe(false);
      expect(store.reviews).toEqual([]);
    });
  });

  describe("fetchAverageRating", () => {
    it("should fetch average rating", async () => {
      (mockReviewRepository.getAverageRating as jest.Mock).mockResolvedValue(
        4.5,
      );

      await store.fetchAverageRating("loc1");

      expect(store.averageRating).toBe(4.5);
      expect(store.error).toBeNull();
    });

    it("should handle error during fetch", async () => {
      const error = new Error("API Error");
      (mockReviewRepository.getAverageRating as jest.Mock).mockRejectedValue(
        error,
      );

      await store.fetchAverageRating("loc1");

      expect(store.error).toBeDefined();
    });
  });

  describe("createReview", () => {
    it("should create new review", async () => {
      (mockReviewRepository.create as jest.Mock).mockResolvedValue(mockReview);

      await store.createReview("user1", "loc1", 5, "Great place!");

      expect(mockReviewRepository.create).toHaveBeenCalledWith({
        userId: "user1",
        locationId: "loc1",
        rating: 5,
        comment: "Great place!",
      });
      expect(store.error).toBeNull();
    });

    it("should validate rating range", async () => {
      await expect(
        store.createReview("user1", "loc1", 6, "Bad"),
      ).rejects.toThrow();

      await expect(
        store.createReview("user1", "loc1", 0, "Bad"),
      ).rejects.toThrow();
    });

    it("should handle creation error", async () => {
      const error = new Error("API Error");
      (mockReviewRepository.create as jest.Mock).mockRejectedValue(error);

      await store.createReview("user1", "loc1", 5, "Great!");

      expect(store.error).toBeDefined();
    });
  });

  describe("reset", () => {
    it("should reset to initial state", async () => {
      store.reviews = [mockReview];
      store.averageRating = 4.5;
      store.error = new Error("Test");

      store.reset();

      expect(store.reviews).toEqual([]);
      expect(store.averageRating).toBe(0);
      expect(store.error).toBeNull();
      expect(store.loading).toBe(false);
    });
  });
});
