// convex/appointments.ts
<<<<<<< HEAD
import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getTenantId } from "./auth";
=======
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getTenantId } from "./auth";
import { Id } from "./_generated/dataModel";
>>>>>>> development

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
<<<<<<< HEAD
            .withIndex("by_tenant_and_date", (q) => q.eq("tenantId", tenantId))
            .order("desc")
            .paginate({ numItems: pageSize, paginationOpts: { after: page > 1 ? ((page - 1) * pageSize).toString() : null } });

        return appointments.map((appointment) => ({
=======
            .withIndex("by_tenant_and_date", (q) => q.eq("tenantId", tenantId as Id<"tenants">))
            .order("desc")
            .paginate({ numItems: pageSize, cursor: page > 1 ? ((page - 1) * pageSize).toString() : undefined });

        return appointments.page.map((appointment) => ({
>>>>>>> development
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
<<<<<<< HEAD
    },
    handler: async (ctx, args) => {
        const tenantId = await getTenantId(ctx);
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Unauthenticated");

        const appointmentId = await ctx.db.insert("appointments", {
            tenantId,
            userId: identity.subject,
            date: args.date,
            status: "scheduled",
            details: args.details,
        });

        return appointmentId;
=======
        serviceId: v.id("services"),
        serviceName: v.string(),
        servicePrice: v.number(),
        if (!identity) {
        serviceDescription: v.string(),
        return await ctx.db.insert("appointments", {
                    tenantId,
                    userId: identity.subject,
                    date: args.date,
                    status: "scheduled",
                    details: args.details,
                });

        }

        const createAppointment = async (ctx, args) => {
            const tenantId = await getTenantId(ctx);
            const appointmentData = {
              tenantId: tenantId as Id<"tenants">,
              userId: identity.subject as Id<"users">,
              date: args.date,
              status: "scheduled",
              details: args.details,
            };
          
            return await ctx.db.insert("appointments", appointmentData);
          };

export const updateStatus = mutation({
    args: {
        id: v.id("appointments"),
        status: v.union(v.literal("completed"), v.literal("no-show"), v.literal("canceled"), v.literal("pending"), v.literal("rescheduled"), v.literal("required")),
    },
    handler: async (ctx, args) => {
        const { id, status } = args;
        await ctx.db.patch(id, { status: status as "completed" | "no_show" | "canceled" | "pending" | "rescheduled" | "required" });
        return { success: true };
>>>>>>> development
    },
});