// convex/availability.ts
import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getTenantId } from "./auth";

export const getAvailableSlots = query({
    args: { startDate: v.number(), endDate: v.number() },
    handler: async (ctx, args) => {
        const tenantId = await getTenantId(ctx);
        return ctx.db
            .query("availableSlots")
            .withIndex("by_tenant_and_date", (q) =>
                q.eq("tenantId", tenantId).gte("date", args.startDate).lte("date", args.endDate)
            )
            .filter((q) => q.eq(q.field("isAvailable"), true))
            .collect();
    },
});

export const setAvailability = mutation({
    args: { date: v.number(), isAvailable: v.boolean() },
    handler: async (ctx, args) => {
        const tenantId = await getTenantId(ctx);
        const existingSlot = await ctx.db
            .query("availableSlots")
            .withIndex("by_tenant_and_date", (q) =>
                q.eq("tenantId", tenantId).eq("date", args.date)
            )
            .first();

        if (existingSlot) {
            await ctx.db.patch(existingSlot._id, { isAvailable: args.isAvailable });
        } else {
            await ctx.db.insert("availableSlots", {
                tenantId,
                date: args.date,
                isAvailable: args.isAvailable,
            });
        }
    },
});