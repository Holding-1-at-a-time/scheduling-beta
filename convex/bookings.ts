import { mutation, query } from './_generated/server'
import { v } from 'convex/values'
import { Id } from './_generated/dataModel'

export const getPreviousServices = query({
    args: {
        vehicleId: v.string(),
        userId: v.id('users'),
        organizationId: v.string(),
    },
    handler: async (ctx, args) => {
        const { vehicleId, userId, organizationId } = args
        const services = await ctx.db
            .query('services')
            .filter(q =>
                q.eq(q.field('vehicleId'), vehicleId) &&
                q.eq(q.field('userId'), userId) &&
                q.eq(q.field('organizationId'), organizationId)
            )
            .order('desc')
            .take(10)
        return services
    },
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
        const { serviceId, vehicleId, userId, organizationId, slot } = args
        const bookingId = await ctx.db.insert('bookings', {
            serviceId,
            vehicleId,
            userId,
            organizationId,
            slot,
            status: 'confirmed',
            createdAt: new Date().toISOString(),
        })
        return bookingId
    },
})