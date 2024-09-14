// convex/vehicles.ts
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";

export const createVehicleProfile = mutation({
    args: {
        tenantId: v.string(),
        vin: v.string(),
        make: v.string(),
        model: v.string(),
        year: v.number(),
    },
    handler: async (ctx, args) => {
        const { tenantId, vin, make, model, year } = args;

        // Validate tenant
        const tenant = await ctx.db
            .query("tenants")
            .filter((q) => q.eq(q.field("id"), tenantId))
            .unique();
        if (!tenant) {
            throw new Error("Tenant not found");
        }

        // Check if VIN already exists for this tenant
        const existingVehicle = await ctx.db
            .query("vehicles")
            .filter((q) => q.and(q.eq(q.field("tenantId"), tenantId), q.eq(q.field("vin"), vin)))
            .unique();
        if (existingVehicle) {
            throw new Error("Vehicle with this VIN already exists");
        }

        // Create new vehicle profile
        const vehicleId = await ctx.db.insert("vehicles", {
            tenantId,
            vin,
            make,
            model,
            year,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        });

        return { id: vehicleId, vin, make, model, year };
    },
});

export const getVehicleByVIN = query({
    args: { tenantId: v.string(), vin: v.string() },
    handler: async (ctx, args) => {
        const { tenantId, vin } = args;

        const vehicle = await ctx.db
            .query("vehicles")
            .filter((q) => q.and(q.eq(q.field("tenantId"), tenantId), q.eq(q.field("vin"), vin)))
            .unique();

        if (!vehicle) {
            throw new Error("Vehicle not found");
        }

        return vehicle;
    },
});

export const decodeVIN = mutation({
    args: { vin: v.string() },
    handler: async (ctx, args) => {
        const { vin } = args;

        // In a real-world scenario, you would integrate with a VIN decoding service here
        // For this example, we'll simulate a VIN decoding process
        const decodedInfo = await simulateVINDecoding(vin);

        return decodedInfo;
    },
});

async function simulateVINDecoding(vin: string): Promise<{ make: string; model: string; year: number }> {
    // This is a placeholder function to simulate VIN decoding
    // In a real application, you would integrate with a VIN decoding service
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                make: "Simulated Make",
                model: "Simulated Model",
                year: 2023,
            });
        }, 1000);
    });
}