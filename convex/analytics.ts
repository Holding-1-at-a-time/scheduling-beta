import { query } from './_generated/server'
import { v } from 'convex/values'
import { getTenantId } from './auth'

interface Appointment {
    userId: string;
    status: string;
    price: number;
    date: Date;
    serviceName: string;
}

interface Review {
    userId: string;
    rating: number;
}

interface Service {
    revenue: number;
    status: string;
}

interface AnalyticsData {
    date: Date;
    revenue: number;
    completedServices: number;
    noShows: number;
    ratings: number[];
}

interface ServiceUsage {
    serviceId: string;
}

interface ServiceBreakdown {
    name: string;
    value: number;
}

export const getBusinessMetrics = query({
    args: {
        tenantId: v.id('tenants'),
        userId: v.id('users'),
        customerId: v.string(),
        status: v.string(),
        service: v.string(),
        servicesName: v.string(),
        serviceId: v.id('services'),
        serviceBreakdown: v.array(v.string()),
    },
    async handler(ctx) {
        const identity = await ctx.auth.getUserIdentity()
        if (!identity) throw new Error('Unauthenticated')

        const userId = identity.subjec


        // Fetch metrics from the database
        const completedAppointments = (await ctx.db
            .query('appointments')
            .filter(q => q.eq(q.field('userId'), userId))
            .filter(q => q.eq(q.field('status'), 'completed'))
            .collect()) ?? []

        const totalRevenue = completedAppointments.reduce((sum, appointment) => sum + appointment.price, 0)


        const completedServices = (await ctx.db
            .query('appointments')
            .filter(q => q.eq(q.field('userId'), userId))
            .filter(q => q.eq(q.field('status'), 'completed'))
            .collect()) ?? 0

        const totalAppointments = (await ctx.db
            .query('appointments')
            .filter(q => q.eq(q.field('userId'), userId))
            .collect()).length ?? 0

        const noShows = (await ctx.db
            .query('appointments')
            .filter(q => q.eq(q.field('userId'), userId))
            .filter(q => q.eq(q.field('status'), 'no-show'))
            .collect()).length ?? 0

        const ratings = (await ctx.db
            .query('reviews')
            .filter(q => q.eq(q.field('userId'), userId))
            .collect()) ?? []

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

export const getThirtyDayRevenueData = query({
    args: {},
    async handler(ctx) {
        const identity = await ctx.auth.getUserIdentity()
        if (!identity) throw new Error('Unauthenticated')

        const userId = identity.subject

        // Fetch revenue data for the last 30 days
        const thirtyDaysAgo = new Date()
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

        const appointments = (await ctx.db
            .query('appointments')
            .filter(q => q.eq(q.field('userId'), userId))
            .filter(q => q.gte(q.field('date'), thirtyDaysAgo))
            .filter(q => q.eq(q.field('status'), 'completed'))
            .collect()) ?? []

        // Group appointments by date and sum the revenue
        const revenueByDate = appointments.reduce
    }
});