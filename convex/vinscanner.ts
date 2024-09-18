import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from './_generated/dataModel';

interface Vehicle {
    vehicleId: v.id<'vehicles'>;
    tenantId: v.Id<"tenants">;
    vin: v.string;
    make: v.string;
    model: v.string;
    year: v.number;
    createdAt: v.number;
    updatedAt: v.number;
}

export const createVehicleProfile = mutation({
    args: {
        tenantId: v.id('tenants'),
        vin: v.string(),
        make: v.string(),
        model: v.string(),
        year: v.number(),
        createdAt: v.number(),
        updatedAt: v.number(),
        
    },
    handler: async (ctx, args): Promise<Vehicle> => {
        const { tenantId, vin, make, model, year } = args;

        const tenant = await ctx.db
            .query("tenants")
            .filter((q) => q.eq(q.field("_id"), tenantId))
            .unique();
        if (!tenant) {
            throw new Error("Tenant not found");
        }

        const existingVehicle = await ctx.db
            .query("vehicles")
            .filter((q) => q.and(q.eq(q.field("tenantId"), tenantId), q.eq(q.field("vin"), vin)))
            .unique();
        if (existingVehicle) {
            throw new Error("Vehicle with this VIN already exists");
        }

        const now = Date.now();
        const vehicleId = await ctx.db.insert("vehicles", {
            tenantId,
            vin,
            make,
            model,
            year,
            createdAt: now,
            updatedAt: now,
        });

        return { _id: vehicleId, tenantId, vin, make, model, year, createdAt: now, updatedAt: now };
    },
});

export const getVehicleByVIN = query({
    args: { tenantId: v.id('tenants'), vin: v.string() },
    handler: async (ctx, args): Promise<Vehicle | null> => {
        const { tenantId, vin } = args;

        const vehicle = await ctx.db
            .query("vehicles")
            .filter((q) => q.and(q.eq(q.field("tenantId"), tenantId), q.eq(q.field("vin"), vin)))
            .unique();

        return vehicle;
    },
});

interface DecodedVINInfo {
    make: string;
    model: string;
    year: number;
}

export const decodeVIN = mutation({
    args: { vin: v.string() },
    handler: async (ctx, args): Promise<DecodedVINInfo> => {
        const { vin } = args;
        return await simulateVINDecoding(vin);
    },
});

async function simulateVINDecoding(vin: string): Promise<DecodedVINInfo> {
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

export const validateVIN = mutation({
    args: { vin: v.string() },
    handler: async (ctx, args): Promise<boolean> => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("Unauthorized");
        }

        const { vin } = args;

        const vinRegex = /^[A-HJ-NPR-Z0-9]{17}$/;
        if (!vinRegex.test(vin)) {
            return false;
        }

        const existingVehicle = await ctx.db
            .query("vehicles")
            .withIndex("by_vin_and_tenantId", (q) =>
                q.eq("vin", vin).eq("tenantId", identity.tokenIdentifier as Id<"tenants">)
            )
            .unique();

        if (existingVehicle) {
            throw new Error("VIN already exists for this tenant");
        }

        return true;
    },
});

interface ScannedVIN {
    _id: Id<"vin">;
    vin: string;
    userId: Id<"users">;
    scannedAt: number;
}

export const onScan = mutation({
    args: { vin: v.string() },
    handler: async (ctx, args): Promise<ScannedVIN> => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("Unauthorized");
        }

        const { vin } = args;

        const isValid = await validateVIN.handler(ctx, { vin });
        if (!isValid) {
            throw new Error("Invalid VIN");
        }

        const scannedAt = Date.now();
        const vinDocId = await ctx.db.insert("vin", {
            vin,
            userId: identity.subject as Id<"users">,
            scannedAt,
        });

        return { _id: vinDocId, vin, userId: identity.subject as Id<"users">, scannedAt };
    },
});