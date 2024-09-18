// convex/appointments.ts
import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getTenantId } from "./auth";

export const list = query({
    args: {
        page: v.number(),
        pageSize: v.number(),
    },
    handler: async (ctx, args) => {
        const tenantId = await getTenantId(ctx);
        const { page, pageSize } = args;

        const appointments = await ctx.db
            .query("appointments")
            .withIndex("by_tenant_and_date", (q) => q.eq("tenantId", tenantId as Id<"tenants">))
            .order("desc")
            .paginate({ numItems: pageSize, cursor: page > 1 ? ((page - 1) * pageSize).toString() : undefined });

        return appointments.page.map((appointment) => ({
            _id: appointment._id,
            date: appointment.date,
            status: appointment.status,
            details: appointment.details,
        }));
    },
});

export const create = mutation({
    args: {
        date: v.number(),
        details: v.string(),
        serviceId: v.id("services"),
        serviceName: v.string(),
        servicePrice: v.number(),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("Unauthenticated");
        }
        return await ctx.db.insert("appointments", {
            tenantId,
            userId: identity.subject,
            date: args.date,
            status: "scheduled",
            details: args.details,
        });
    },
});

export const updateStatus = mutation({
    args: {
        id: v.id("appointments"),
        status: v.union(v.literal("completed"), v.literal("no-show"), v.literal("canceled"), v.literal("pending"), v.literal("rescheduled"), v.literal("required")),
    },
    handler: async (ctx, args) => {
        const { id, status } = args;
        await ctx.db.patch(id, { status: status as "completed" | "no_show" | "canceled" | "pending" | "rescheduled" | "required" });
        return { success: true };
    },
});

export const schedule = mutation({
    args: {
        vehicleInfo: v.object({
            make: v.string(),
            model: v.string(),
            year: v.string(),
            condition: v.string(),
        }),
        estimatedCost: v.number(),
        estimatedDuration: v.number(),
        date: v.string(),
        time: v.string(),
    },
    handler: async (ctx, args) => {
        // Implement appointment scheduling logic here
        // This might involve checking availability, creating a booking record, etc.
        const appointmentId = await ctx.db.insert('appointments', {
            ...args,
            status: 'scheduled',
        })

        return appointmentId
    },
})