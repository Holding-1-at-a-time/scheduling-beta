// Unit tests for: onScan

import { onScan, validateVIN } from "../vinscanner";

// Mocking the necessary dependencies
class MockMutationCtx {
  public auth = {
    getUserIdentity: jest.fn().mockResolvedValue({ id: "mockUserId" }),
  };
  public db = {
    insert: jest
      .fn()
      .mockResolvedValue({
        id: "mockVinId",
        vin: "mockVin",
        userId: "mockUserId",
        scannedAt: new Date(),
      }),
  };
}

jest.mock("../path/to/your/module", () => ({
  validateVIN: jest.fn(),
}));

describe("onScan() onScan method", () => {
  let mockCtx: MockMutationCtx;

  beforeEach(() => {
    mockCtx = new MockMutationCtx() as any;
  });

  describe("Happy Path", () => {
    it("should successfully scan and save a valid VIN", async () => {
      // Arrange
      (validateVIN as jest.Mock).mockResolvedValue(true);

      // Act
      const result = await onScan(mockCtx as any, "mockVin");

      // Assert
      expect(mockCtx.auth.getUserIdentity).toHaveBeenCalled();
      expect(validateVIN).toHaveBeenCalledWith({ vin: "mockVin" });
      expect(mockCtx.db.insert).toHaveBeenCalledWith("vin", {
        vin: "mockVin",
        userId: "mockUserId",
        scannedAt: expect.any(Date),
      });
      expect(result).toEqual({
        id: "mockVinId",
        vin: "mockVin",
        userId: "mockUserId",
        scannedAt: expect.any(Date),
      });
    });
  });

  describe("Edge Cases", () => {
    it("should throw an error if user is unauthorized", async () => {
      // Arrange
      mockCtx.auth.getUserIdentity.mockResolvedValue(null);

      // Act & Assert
      await expect(onScan(mockCtx as any, "mockVin")).rejects.toThrow(
        ConvexError,
      );
      expect(mockCtx.auth.getUserIdentity).toHaveBeenCalled();
    });

    it("should throw an error if VIN is invalid", async () => {
      // Arrange
      (validateVIN as jest.Mock).mockResolvedValue(false);

      // Act & Assert
      await expect(onScan(mockCtx as any, "mockVin")).rejects.toThrow(
        ConvexError,
      );
      expect(validateVIN).toHaveBeenCalledWith({ vin: "mockVin" });
    });
  });
});

// End of unit tests for: onScan
