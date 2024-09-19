import { mutation, query } from './_generated/server'
import { v } from 'convex/values'
import { Id } from './_generated/dataModel'

export const getPreviousServices = query({
    // ... existing code ...
})

export const createBooking = mutation({
    args: {
        serviceId: v.id('services'),
        vehicleId: v.string(),
        userId: v.id('users'),
        organizationId: v.string(),
        slot: v.object({
            start: v.string(),
            end: v.string(),
        }),
    },
    handler: async (ctx, args) => {
        const { serviceId, vehicleId, userId, organizationId, slot } = args;
        const bookingId = await ctx.db.insert('bookings', {
            serviceId,
            vehicleId,
            userId,
            organizationId,
            slot,
            status: 'confirmed',
            createdAt: new Date().toISOString(),
        });
        return { bookingId };
    },
});

export const create = mutation({
    args: {
        // Define your argument schema here
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("Unauthenticated");
        }
        await ctx.db.insert('bookings', {
            // ... booking data ...
        });
    },
});