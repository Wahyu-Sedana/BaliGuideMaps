import {
  calculateDistance,
  formatDistance,
  getCategoryColor,
  getCategoryIcon,
} from "../src/core/utils/helpers";

describe("Helpers", () => {
  describe("calculateDistance", () => {
    it("should calculate distance correctly", () => {
      const distance = calculateDistance(-8.6705, 115.2126, -8.67, 115.21);
      expect(distance).toBeGreaterThan(0);
      expect(distance).toBeLessThan(1);
    });

    it("should return 0 for same coordinates", () => {
      const distance = calculateDistance(-8.6705, 115.2126, -8.6705, 115.2126);
      expect(distance).toBe(0);
    });
  });

  describe("formatDistance", () => {
    it("should format distance in meters for values less than 1km", () => {
      const formatted = formatDistance(0.5);
      expect(formatted).toBe("500m");
    });

    it("should format distance in kilometers for values >= 1km", () => {
      const formatted = formatDistance(2.5);
      expect(formatted).toBe("2.5km");
    });
  });

  describe("getCategoryColor", () => {
    it("should return green for wisata", () => {
      expect(getCategoryColor("wisata")).toBe("#22c55e");
    });

    it("should return red for health", () => {
      expect(getCategoryColor("health")).toBe("#ef4444");
    });

    it("should return blue for hotel", () => {
      expect(getCategoryColor("hotel")).toBe("#3b82f6");
    });

    it("should return gray for unknown category", () => {
      expect(getCategoryColor("unknown")).toBe("#6b7280");
    });
  });

  describe("getCategoryIcon", () => {
    it("should return temple emoji for wisata", () => {
      expect(getCategoryIcon("wisata")).toBe("🏛️");
    });

    it("should return hospital emoji for health", () => {
      expect(getCategoryIcon("health")).toBe("🏥");
    });

    it("should return hotel emoji for hotel", () => {
      expect(getCategoryIcon("hotel")).toBe("🏨");
    });

    it("should return pin emoji for unknown category", () => {
      expect(getCategoryIcon("unknown")).toBe("📍");
    });
  });
});
