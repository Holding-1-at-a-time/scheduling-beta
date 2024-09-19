// convex/analytics.ts
import { query } from './_generated/server'
import { v } from 'convex/values'
import { getTenantId } from './auth'

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
        if (!identity) {
            throw new Error('Unauthenticated')
        }
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
            acc[date] = (acc[date] || 0) + appointment.servicePrice
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
        if (!identity) {
            throw new Error('Unauthenticated')
        }
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

export const getMetrics = query(async ({ db }) => {
    try {
        const totalRevenue = await db.query("services").sum("revenue") ?? 0;
        const completedServices = await db.query("services").filter({ status: "completed" }).count();
        const totalAppointments = await db.query("appointments").count();
        const noShowAppointments = await db.query("appointments").filter({ status: "no-show" }).count();
        const noShowRate = totalAppointments > 0 ? noShowAppointments / totalAppointments : 0;
        const averageRating = await db.query("ratings").avg("score") ?? 0;

        return {
            totalRevenue,
            completedServices,
            noShowRate,
            averageRating,
        };
    } catch (error) {
        console.error("Error fetching metrics:", error);
        throw new Error("Failed to fetch analytics metrics.");
    }
});

// convex/analytics.ts

export const getAnalyticsData = query({
    args: {
        tenantId: v.string(),
        date: v.string(),
        serviceName: v.string(),
        servicePrice: v.number(),
        revenue: v.number(),
        completedServices: v.number(),
        noShows: v.number(),
        averageRating: v.number(),
        dailyData: v.array(v.object({
            date: v.string(),
            revenue: v.number(),
            completedServices: v.number(),
            noShows: v.number(),
            averageRating: v.number(),
            ratings: v.array(v.number()),
            totalRevenue: v.number(),
            totalAppointments: v.number(),
            totalNoShows: v.number(),
        })),
    },
    handler: async (ctx) => {
        const tenantId = await getTenantId(ctx, args);

        const analyticsData = await ctx.db
            .query("analytics")
            .withIndex("by_tenant_and_date", (q) => q.eq("tenantId", tenantId))
            .order("desc")
            .take(30);

        return analyticsData.map((data) => ({
            date: new Date(data.date).toISOString().split('T')[0],
            revenue: data.revenue,
        }));
    },
});



export const getDetailedAnalytics = query({
    args: {},
    handler: async (ctx) => {
        const tenantId = await getTenantId(ctx);

        const analyticsData = await ctx.db
            .query("analytics")
            .withIndex("by_tenant_and_date", (q) => q.eq("tenantId", tenantId))
            .order("desc")
            .take(30);

        const totalRevenue = analyticsData.reduce((sum, data) => sum + data.revenue, 0);
        const completedServices = analyticsData.reduce((sum, data) => sum + data.completedServices, 0);
        const totalNoShows = analyticsData.reduce((sum, data) => sum + data.noShows, 0);
        const allRatings = analyticsData.flatMap(data => data.ratings);

        return {
            totalRevenue,
            completedServices,
            noShowRate: totalNoShows / (completedServices + totalNoShows),
            averageRating: allRatings.length > 0 ? allRatings.reduce((sum, rating) => sum + rating, 0) / allRatings.length : 0,
            dailyData: analyticsData.map(data => ({
                date: new Date(data.date).toISOString().split('T')[0],
                revenue: data.revenue,
                completedServices: data.completedServices,
                noShows: data.noShows,
                averageRating: data.ratings.length > 0 ? data.ratings.reduce((sum, rating) => sum + rating, 0) / data.ratings.length : 0,
            })),
        };
    },
});