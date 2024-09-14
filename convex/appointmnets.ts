// convex/appointments.ts
import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getTenantId } from "./auth";

export const getAvailableSlots = query({
    args: { startDate: v.number(), endDate: v.number() },
    handler: async (ctx, args) => {
        const tenantId = await getTenantId(ctx);
        const slots = await ctx.db
            .query("availableSlots")
            .withIndex("by_tenant_and_date", (q) =>
                q.eq("tenantId", tenantId).gte("date", args.startDate).lte("date", args.endDate)
            )
            .filter((q) => q.eq(q.field("isAvailable"), true))
            .collect();
        return slots.map((slot) => new Date(slot.date));
    },
});

export const bookAppointment = mutation({
    args: {
        date: v.number(),
        customerId: v.string(),
        serviceId: v.string(),
    },
    handler: async (ctx, args) => {
        const tenantId = await getTenantId(ctx);
        const slot = await ctx.db
            .query("availableSlots")
            .withIndex("by_tenant_and_date", (q) =>
                q.eq("tenantId", tenantId).eq("date", args.date)
            )
            .filter((q) => q.eq(q.field("isAvailable"), true))
            .first();

        if (!slot) {
            throw new Error("Selected slot is not available");
        }

        const appointmentId = await ctx.db.insert("appointments", {
            tenantId,
            date: args.date,
            customerId: args.customerId,
            serviceId: args.serviceId,
            status: "scheduled",
        });

        await ctx.db.patch(slot._id, { isAvailable: false });

        return appointmentId;
    },
});

export const listByTenant = query({
    handler: async (ctx) => {
        const tenantId = await getTenantId(ctx);
        return ctx.db
            .query("appointments")
            .withIndex("by_tenant_and_date", (q) => q.eq("tenantId", tenantId))
            .order("desc")
            .collect();
    },
});

export const create = mutation({
    args: {
        date: v.number(),
        customerId: v.string(),
        serviceId: v.string(),
    },
    handler: async (ctx, args) => {
        const tenantId = await getTenantId(ctx);
        return ctx.db.insert("appointments", {
            tenantId,
            date: args.date,
            customerId: args.customerId,
            serviceId: args.serviceId,
            status: "scheduled",
        });
    },
});

export const update = mutation({
    args: {
        id: v.id("appointments"),
        date: v.optional(v.number()),
        status: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const tenantId = await getTenantId(ctx);
        const appointment = await ctx.db.get(args.id);
        if (!appointment || appointment.tenantId !== tenantId) {
            throw new Error("Appointment not found or access denied");
        }
        return ctx.db.patch(args.id, {
            ...(args.date && { date: args.date }),
            ...(args.status && { status: args.status }),
        });
    },
});

export const cancel = mutation({
    args: { id: v.id("appointments") },
    handler: async (ctx, args) => {
        const tenantId = await getTenantId(ctx);
        const appointment = await ctx.db.get(args.id);
        if (!appointment || appointment.tenantId !== tenantId) {
            throw new Error("Appointment not found or access denied");
        }
        return ctx.db.patch(args.id, { status: "cancelled" });
    },
});

export const listPaginated = query({
    args: { page: v.number(), pageSize: v.number() },
    handler: async (ctx, args) => {
        const tenantId = await getTenantId(ctx);
        const { page, pageSize } = args;
        const appointments = await ctx.db
            .query("appointments")
            .withIndex("by_tenant_and_date", (q) => q.eq("tenantId", tenantId))
            .order("desc")
            .paginate({ numItems: pageSize, paginationOpts: { after: page > 1 ? ((page - 1) * pageSize).toString() : null } });

        return {
            appointments: appointments.map(appointment => ({
                id: appointment._id,
                date: appointment.date,
                customerId: appointment.customerId,
                status: appointment.status,
                isPaid: appointment.isPaid || false,
            })),
            hasMore: appointments.length === pageSize,
        };
    },
});

export const updateStatus = mutation({
    args: { id: v.id("appointments"), status: v.string() },
    handler: async (ctx, args) => {
        const tenantId = await getTenantId(ctx);
        const appointment = await ctx.db.get(args.id);
        if (!appointment || appointment.tenantId !== tenantId) {
            throw new Error("Appointment not found or access denied");
        }
        await ctx.db.patch(args.id, { status: args.status });
    },
});
