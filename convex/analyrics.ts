// convex/analytics.ts
import { query } from './_generated/server'
import { v } from 'convex/values'

export const getBusinessMetrics = query({
    args: {},
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity()
        if (!identity) throw new Error('Unauthenticated')

        const userId = identity.subject

        // Fetch metrics from the database
        const totalRevenue = await ctx.db
            .query('appointments')
            .filter(q => q.eq(q.field('userId'), userId))
            .filter(q => q.eq(q.field('status'), 'completed'))
            .sum('price')

        const completedServices = await ctx.db
            .query('appointments')
            .filter(q => q.eq(q.field('userId'), userId))
            .filter(q => q.eq(q.field('status'), 'completed'))
            .count()

        const totalAppointments = await ctx.db
            .query('appointments')
            .filter(q => q.eq(q.field('userId'), userId))
            .count()

        const noShows = await ctx.db
            .query('appointments')
            .filter(q => q.eq(q.field('userId'), userId))
            .filter(q => q.eq(q.field('status'), 'no-show'))
            .count()

        const ratings = await ctx.db
            .query('reviews')
            .filter(q => q.eq(q.field('userId'), userId))
            .collect()

        const averageRating = ratings.length > 0
            ? ratings.reduce((sum, review) => sum + review.rating, 0) / ratings.length
            : 0

        return {
            totalRevenue,
            completedServices,
            noShowRate: noShows / totalAppointments,
            averageRating,
        }
    },
})

export const getRevenueData = query({
    args: {},
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity()
        if (!identity) throw new Error('Unauthenticated')

        const userId = identity.subject

        // Fetch revenue data for the last 30 days
        const thirtyDaysAgo = new Date()
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

        const appointments = await ctx.db
            .query('appointments')
            .filter(q => q.eq(q.field('userId'), userId))
            .filter(q => q.gte(q.field('date'), thirtyDaysAgo))
            .filter(q => q.eq(q.field('status'), 'completed'))
            .collect()

        // Group appointments by date and sum the revenue
        const revenueByDate = appointments.reduce((acc, appointment) => {
            const date = new Date(appointment.date).toISOString().split('T')[0]
            acc[date] = (acc[date] || 0) + appointment.price
            return acc
        }, {} as Record<string, number>)

        // Convert to array and sort by date
        return Object.entries(revenueByDate)
            .map(([date, revenue]) => ({ date, revenue }))
            .sort((a, b) => a.date.localeCompare(b.date))
    },
})

export const getServiceBreakdown = query({
    args: {},
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity()
        if (!identity) throw new Error('Unauthenticated')

        const userId = identity.subject

        const appointments = await ctx.db
            .query('appointments')
            .filter(q => q.eq(q.field('userId'), userId))
            .filter(q => q.eq(q.field('status'), 'completed'))
            .collect()

        // Group appointments by service and count occurrences
        const serviceBreakdown = appointments.reduce((acc, appointment) => {
            acc[appointment.serviceName] = (acc[appointment.serviceName] || 0) + 1
            return acc
        }, {} as Record<string, number>)

        // Convert to array format for the pie chart
        return Object.entries(serviceBreakdown)
            .map(([name, value]) => ({ name, value }))
    },
})