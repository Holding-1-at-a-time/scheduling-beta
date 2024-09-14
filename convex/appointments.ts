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
            .withIndex("by_tenant_and_date", (q) => q.eq("tenantId", tenantId))
            .order("desc")
            .paginate({ numItems: pageSize, paginationOpts: { after: page > 1 ? ((page - 1) * pageSize).toString() : null } });

        return appointments.map((appointment) => ({
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
    },
});