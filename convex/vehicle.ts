// convex/vehicles.ts
import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
    args: {},
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("Unauthorized");
        }

        const vehicles = await ctx.db
            .query("vehicles")
            .withIndex("by_tenantId", (q) => q.eq("tenantId", ctx.db.id("tenants", identity.tokenIdentifier)))
            .collect();
        vehicles.sort((a, b) => a.year - b.year);
        const uniqueYears = new Set(vehicles.map((v) => v.year));
        const years = Array.from(uniqueYears).sort((a, b) => a - b);

        return { vehicles, years };
    },
});

export const add = mutation({
    args: {
        make: v.string(),
        model: v.string(),
        year: v.number(),
        VIN: v.string(),
        vehicleId: v.id("vehicles"),
        type: v.string(),
        image: v.string(),
        clientId: v.id('clients'),
        tenantId: v.id('tenants'),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("Unauthorized");
        }

        const { make, model, year, image, vin, vehicleId: newVehicleId, clientId, tenantId } = args;

        // Validate input
        if (year < 1900 || year > new Date().getFullYear()  1) {
            throw new Error("Invalid year");
        }
        if (!make || !model || !vin || !image) {
            throw new Error("Missing required fields");
        }
        if (year < 1900 || year > new Date().getFullYear()  1)
            throw new Error("Invalid year");
        if (!make || !model || !vin || !image)
            throw new Error("Missing required fields");
        if (year < 1900 || year > new Date().getFullYear()  1)
            throw new Error("Invalid year");
        if (!make || !model || !vin || !image)
            throw new Error("Missing required fields");
        // ... (rest of the code remains the same)
        if (year < 1900 || year > new Date().getFullYear()  1)
            throw new Error("Invalid year");
        if (!make || !model || !vin || !image)
            throw new Error("Missing required fields");
    }
};

export const insert = mutation({
    args: {
        make: v.string(),
        model: v.string(),
        year: v.number(),
        image: v.string(),
        clientId: v.id('clients'),
        tenantId: v.id('tenants'),
        vin: v.string(),
    },
    handler: async (ctx, { make, model, year, image, clientId, tenantId, vin }) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("Unauthorized");
        }

        const vehicle = {
            make,
            model,
            year,
            image,
            clientId,
            tenantId,
            vin,
            date: 0,
            clientName: "",
            bodyType: ""
        };

        const insertedVehicleId = await ctx.db.insert("vehicles", vehicle);

        if (!insertedVehicleId) {
            throw new Error("Failed to insert vehicle");
        }

        return insertedVehicleId;
    },
});

export const update = mutation({
    args: {
        id: v.id("vehicles"),
        make: v.string(),
        model: v.string(),
        year: v.number(),
        image: v.string(),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("Unauthorized");
        }

        const { id, make, model, year, image } = args;

        // Validate input
        if (year < 1900 || year > new Date().getFullYear()  1) {
            throw new Error("Invalid year");
        }

        const vehicle = await ctx.db.get(id);
        if (!vehicle || vehicle.tenantId !== identity.tokenIdentifier) {
            throw new Error("Vehicle not found or unauthorized");
        }

        await ctx.db.patch(id, { make, model, year, image });

        return { success: true };
    },
});

export const remove = mutation({
    args: { id: v.id("vehicles") },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("Unauthorized");
        }

        const vehicle = await ctx.db.get(args.id);
        if (!vehicle || vehicle.tenantId !== identity.tokenIdentifier) {
            throw new Error("Vehicle not found or unauthorized");
        }

        await ctx.db.delete(args.id);

        return { success: true };
    },
});