import { query } from './_generated/server'
import { v } from 'convex/values'
import { Id } from './_generated/dataModel'

interface AppointmentData {
    _id: Id<'appointments'>;
    userId: Id<'users'>;
    tenantId: Id<'tenants'>;
    status: 'completed' | 'no-show' | 'scheduled' | 'canceled' | 'pending' | 'rescheduled' | 'in_progress';
    servicePrice: number;
    date: number;
}

interface BusinessMetrics {
    totalRevenue: number;
    completedServices: number;
    noShowRate: number;
    averageRating: number;
}

interface RevenueDataPoint {
    date: string;
    revenue: number;
}

export const getBusinessMetrics = query({
    args: {
        tenantId: v.id('tenants'),
    },
    async handler(ctx, args): Promise<BusinessMetrics> {
        const { tenantId } = args;

        const completedAppointments = await ctx.db
            .query('appointments')
            .filter(q => q.eq(q.field('tenantId'), tenantId))
            .filter(q => q.eq(q.field('status'), 'completed'))
            .collect() as AppointmentData[];

        const totalRevenue = completedAppointments.reduce((sum, appointment) => sum + appointment.servicePrice, 0);

        const completedServices = completedAppointments.length;

        const totalAppointments = await ctx.db
            .query('appointments')
            .filter(q => q.eq(q.field('tenantId'), tenantId))
            .collect() as AppointmentData[];

        const noShows = totalAppointments.filter(a => a.status === 'no-show').length;

        const ratings = await ctx.db
            .query('assessments')
            .filter(q => q.eq(q.field('tenantId'), tenantId))
            .filter(q => q.neq(q.field('rating'), undefined))
            .collect();

        const averageRating = ratings.length > 0
            ? ratings.reduce((sum, review) => sum + (review.rating as number), 0) / ratings.length
            : 0;

        return {
            totalRevenue,
            completedServices,
            noShowRate: totalAppointments.length > 0 ? noShows / totalAppointments.length : 0,
            averageRating,
        };
    },
});

export const getRevenueData = query({
    args: {
        tenantId: v.id('tenants'),
    },
    async handler(ctx, args): Promise<RevenueDataPoint[]> {
        const { tenantId } = args;

        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const appointments = await ctx.db
            .query('appointments')
            .filter(q => q.eq(q.field('tenantId'), tenantId))
            .filter(q => q.gte(q.field('date'), thirtyDaysAgo.getTime()))
            .filter(q => q.eq(q.field('status'), 'completed'))
            .collect() as AppointmentData[];

        const revenueByDate = appointments.reduce<Record<string, number>>((acc, appointment) => {
            const date = new Date(appointment.date).toISOString().split('T')[0];
            acc[date] = (acc[date] || 0) + appointment.servicePrice;
            return acc;
        }, {});

        return Object.entries(revenueByDate).map(([date, revenue]) => ({ date, revenue }));
    },
});

export const getAnalyticsData = query({
    args: {
        tenantId: v.id('tenants'),
    },
    async handler(ctx, args): Promise<BusinessMetrics> {
        const { tenantId } = args;

        const completedAppointments = await ctx.db
            .query('appointments')
            .filter(q => q.eq(q.field('tenantId'), tenantId))
            .filter(q => q.eq(q.field('status'), 'completed'))
            .collect() as AppointmentData[];

        const totalRevenue = completedAppointments.reduce((sum, appointment) => sum + appointment.servicePrice, 0);

        const completedServices = completedAppointments.length;

        const noShows = await ctx.db
            .query('appointments')
            .filter(q => q.eq(q.field('tenantId'), tenantId))
            .filter(q => q.eq(q.field('status'), 'no-show'))
            .collect() as AppointmentData[];

        const totalAppointments = await ctx.db
            .query('appointments')
            .filter(q => q.eq(q.field('tenantId'), tenantId))
            .collect() as AppointmentData[];

        const ratings = await ctx.db
            .query('assessments')
            .filter(q => q.eq(q.field('tenantId'), tenantId))
            .filter(q => q.neq(q.field('rating'), undefined))
            .collect();

        const averageRating = ratings.length > 0
            ? ratings.reduce((sum, review) => sum + (review.rating as number), 0) / ratings.length
            : 0;

        return {
            totalRevenue,
            completedServices,
            noShowRate: totalAppointments.length > 0 ? noShows.length / totalAppointments.length : 0,
            averageRating,
        };
    },
});