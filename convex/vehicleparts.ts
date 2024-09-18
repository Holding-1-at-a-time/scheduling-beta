// convex/vehicleParts.ts
import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";

export const list = query({
    args: {
        page: v.number(),
        pageSize: v.number(),
        tenantId: v.id("tenants"),
        vehicleId: v.id("vehicles"),
        part: v.string(),
        issue: v.string(),
        status: v.string(),
        sort: v.optional(v.string()),
        order: v.optional(v.string()),
        search: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("Unauthorized");
        }

        const vehicleParts = await ctx.db
            .query("vehicleParts")
            .collect();

        return vehicleParts;
    },
});

export const save = mutation({
    args: {
        tenantId: v.id("tenants"),
        vehicleId: v.id("vehicles"),
        assessment: v.object({
            date: v.string(),
            images: v.array(v.string()),
            notes: v.optional(v.string()),
            part: v.string(),
            status: v.string(),
        }),
        vehiclePart: v.object({
            part: v.string(),
            issue: v.string(),
            vehicleId: v.id("vehicles"),
            clientId: v.id('clients'),
            clientEmail: v.string(),
            clientName: v.string(),
            clientPhone: v.string(),
        }),
    },
    handler: async (ctx, { vehicleId, assessment, tenantId }) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("Unauthorized");
        }

        const vehicle = await ctx.db.get(vehicleId);
        if (!vehicle || vehicle.tenantId !== identity.tokenIdentifier) {
            throw new Error("Vehicle not found or unauthorized");
        }

        const existingAssessment = await ctx.db
            .query("assessments")
            .withIndex("by_vehicleId", (q) => q.eq("vehicleId", vehicleId))
            .unique();

        if (existingAssessment) {
            await ctx.db.patch(existingAssessment._id, { assessment });
        } else {
            await ctx.db.insert("assessments", {
                vehicleId,
                assessment,
                tenantId: identity.tokenIdentifier,
            });
        }

        return { success: true };
    },
});