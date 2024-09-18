import { useAuth } from '@clerk/nextjs';
import { Id } from './_generated/dataModel.d';
// convex/vehicles.ts
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

interface Vehicle {
    tenantId: Id<"tenants">;
    vin: string;
    make: string;
    model: string;
    year: number;
    createdAt: string;
    updatedAt: string;
}

export const createVehicleProfile = mutation({
    args: {
        tenantId: v.id('tenants'),
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
            .filter((q) => q.eq(q.field("tenantId"), tenantId))
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

        const vehicleId = await ctx.db.insert("vehicles", {
            tenantId,
            vin,
            make,
            model,
            year,
        });       // Create new vehicle profile
 

        return { id: vehicleId, vin, make, model, year };
    },
});

export const getVehicleByVIN = query({
    args: { tenantId: v.id('tenants'), vin: v.string() },
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

export const validateVIN = mutation({
    args: { vin: v.string(), useAuth:  },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("Unauthorized");
        }

        const { vin } = args;

        // Basic VIN validation
        const vinRegex = /^[A-HJ-NPR-Z0-9]{17}$/;
        if (!vinRegex.test(vin)) {
            return false;
        }

        // Check for VIN uniqueness within the tenant
        const existingVehicle = await ctx.db
            .query("vehicles")
            .withIndex("by_vin_and_tenantId", (q) =>
                q.eq("vin", vin).eq("tenantId", identity.tokenIdentifier)
            )
            .unique();

        if (existingVehicle) {
            throw new Error("VIN already exists for this tenant");
        }

        // In a real-world scenario, you might want to make an API call to a VIN decoding service here
        // to verify the VIN and get additional vehicle information

        return true;
    },
});


export const onScan = mutation({
    args: { vin: String },
    handler: async ({ db, auth }, { vin }) => {
        // Get the current user's ID
        const userId = await auth.getUserIdentity()?.id;
        if (!userId) {
            throw new Error("Unauthorized");
        }

        // Validate the VIN
        const isValid = await validateVIN({ vin });
        if (!isValid) {
            throw new Error("Invalid VIN");
        }

        // Save the scanned VIN to the database
        const vinDoc = await db.insert("vin", {
            vin,
            userId,
            scannedAt: new Date(),
        });

        // Return the saved VIN document
        return vinDoc;
    },
});