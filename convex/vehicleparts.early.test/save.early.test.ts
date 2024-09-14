// Unit tests for: save

import { v } from "convex/values";
import { save } from "../vehicleparts";

// __tests__/vehicleParts.test.ts

// __tests__/vehicleParts.test.ts
describe("save() save method", () => {
  let ctx: any;
  let args: any;

  beforeEach(() => {
    // Mock context and arguments
    ctx = {
      auth: {
        getUserIdentity: jest.fn(),
      },
      db: {
        get: jest.fn(),
        query: jest.fn(),
        patch: jest.fn(),
        insert: jest.fn(),
      },
    };

    args = {
      tenantId: v.id("tenants"),
      part: "engine",
      issue: "leak",
      vehicleId: v.id("vehicles"),
      assessment: [
        {
          part: "engine",
          issue: "leak",
          status: "pending",
          images: ["http://example.com/image1.jpg"],
          date: "2023-10-01",
          notes: "Check for oil leak",
        },
      ],
      clientId: v.id("clients"),
      clientName: "John Doe",
      clientEmail: "john.doe@example.com",
      clientPhone: "1234567890",
    };
  });

  describe("Happy path", () => {
    it("should save a new assessment when no existing assessment is found", async () => {
      // Arrange
      ctx.auth.getUserIdentity.mockResolvedValue({
        tokenIdentifier: args.tenantId,
      });
      ctx.db.get.mockResolvedValue({ tenantId: args.tenantId });
      ctx.db.query.mockReturnValue({
        withIndex: jest.fn().mockReturnValue({
          unique: jest.fn().mockResolvedValue(null),
        }),
      });

      // Act
      const result = await save.handler(ctx, args);

      // Assert
      expect(ctx.db.insert).toHaveBeenCalledWith("assessments", {
        vehicleId: args.vehicleId,
        assessment: args.assessment,
        tenantId: args.tenantId,
      });
      expect(result).toEqual({ success: true });
    });

    it("should update an existing assessment when found", async () => {
      // Arrange
      const existingAssessment = { _id: "existingId", assessment: [] };
      ctx.auth.getUserIdentity.mockResolvedValue({
        tokenIdentifier: args.tenantId,
      });
      ctx.db.get.mockResolvedValue({ tenantId: args.tenantId });
      ctx.db.query.mockReturnValue({
        withIndex: jest.fn().mockReturnValue({
          unique: jest.fn().mockResolvedValue(existingAssessment),
        }),
      });

      // Act
      const result = await save.handler(ctx, args);

      // Assert
      expect(ctx.db.patch).toHaveBeenCalledWith(existingAssessment._id, {
        assessment: args.assessment,
      });
      expect(result).toEqual({ success: true });
    });
  });

  describe("Edge cases", () => {
    it("should throw an error if user is unauthorized", async () => {
      // Arrange
      ctx.auth.getUserIdentity.mockResolvedValue(null);

      // Act & Assert
      await expect(save.handler(ctx, args)).rejects.toThrow("Unauthorized");
    });

    it("should throw an error if vehicle is not found or unauthorized", async () => {
      // Arrange
      ctx.auth.getUserIdentity.mockResolvedValue({
        tokenIdentifier: args.tenantId,
      });
      ctx.db.get.mockResolvedValue(null);

      // Act & Assert
      await expect(save.handler(ctx, args)).rejects.toThrow(
        "Vehicle not found or unauthorized",
      );
    });

    it("should throw an error if vehicle belongs to a different tenant", async () => {
      // Arrange
      ctx.auth.getUserIdentity.mockResolvedValue({
        tokenIdentifier: args.tenantId,
      });
      ctx.db.get.mockResolvedValue({ tenantId: "differentTenantId" });

      // Act & Assert
      await expect(save.handler(ctx, args)).rejects.toThrow(
        "Vehicle not found or unauthorized",
      );
    });
  });
});

// End of unit tests for: save
