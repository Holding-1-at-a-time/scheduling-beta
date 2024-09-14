// convex/bookings.ts
import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getTenantId } from "./auth";

export const getById = query({
    args: { id: v.id("appointments") },
    handler: async (ctx, args) => {
        const tenantId = await getTenantId(ctx);
        const booking = await ctx.db.get(args.id);
        if (!booking || booking.tenantId !== tenantId) {
            throw new Error("Booking not found or access denied");
        }
        return booking;
    },
});

export const sendConfirmationEmail = mutation({
    args: { bookingId: v.id("appointments") },
    handler: async (ctx, args) => {
        const tenantId = await getTenantId(ctx);
        const booking = await ctx.db.get(args.bookingId);
        if (!booking || booking.tenantId !== tenantId) {
            throw new Error("Booking not found or access denied");
        }
        // In a real-world scenario, you would integrate with an email service here
        console.log(`Sending confirmation email for booking ${args.bookingId}`);
        return true;
    },
});