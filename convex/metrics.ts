// convex/metrics.ts
import { query } from './_generated/server'
import { v } from 'convex/values'

export const getAppointmentDurations = query({
    args: { tenantId: v.string() },
    handler: async (ctx, args) => {
        const { tenantId } = args
        // Fetch and return appointment durations
        // This is a placeholder implementation
        return [
            { date: '2023-01-01', duration: 60 },
            { date: '2023-01-02', duration: 75 },
            // ... more data
        ]
    },
})

export const getCustomerSatisfaction = query({
    args: { tenantId: v.string() },
    handler: async (ctx, args) => {
        const { tenantId } = args
        // Fetch and return customer satisfaction scores
        // This is a placeholder implementation
        return [
            { date: '2023-01-01', satisfactionScore: 4.5 },
            { date: '2023-01-02', satisfactionScore: 4.7 },
            // ... more data
        ]
    },
})

export const getStaffProductivity = query({
    args: { tenantId: v.string() },
    handler: async (ctx, args) => {
        const { tenantId } = args
        // Fetch and return staff productivity scores
        // This is a placeholder implementation
        return [
            { staffName: 'John Doe', productivityScore: 85 },
            { staffName: 'Jane Smith', productivityScore: 92 },
            // ... more data
        ]
    },
})

export const completedServiceCount = query({
    args: { tenantId: v.id('tenants'), servicesName: v.string() },
    handler: async (ctx, args) => {
        const { tenantId, servicesName } = args;
        const services = await ctx.db
            .query('services')
            .filter(q => q.eq(q.field('tenantId'), tenantId) && q.eq(q.field('name'), servicesName))
            .collect();
        const appointments = await ctx.db
            .query('appointments')
            .filter(q => 
                q.eq(q.field('tenantId'), tenantId) && 
                q.and(
                    services.map(s => q.eq(q.field('serviceId'), s._id))
                )
            )
            .collect();
        return appointments.filter(a => a.status === 'completed').length;
    },
});

export const totalRevenue = query({
    args: { tenantId: v.id('tenants'), servicesName: v.string()},
    handler: async (ctx, args) => {
        const { tenantId, servicesName } = args
        const services = await ctx.db
            .query('services')
            .filter(q => q.eq(q.field('tenantId'), tenantId) && q.eq(q.field('name'), servicesName))
            .collect()
        return services.reduce((acc, s) => acc + s.price, 0)
    },
});

export const noShowAppointmentCount = query({
    args: { tenantId: v.id('tenants'), appointmentId: v.id('appointments')},
    handler: async (ctx, args) => {
        const { tenantId, appointmentId } = args;
        const appointments = await ctx.db
            .query('appointments')
            .filter(q => q.eq(q.field('tenantId'), tenantId) && q.eq(q.field('_id'), appointmentId))
            .collect();
        return appointments.filter(a => a.status === 'no_show').length;
    },
});

export const totalAppointmentCount = query({
    args: { tenantId: v.id('tenants'), appointmentId: v.id('appointments')},
    handler: async (ctx, args) => {
        const { tenantId, appointmentId } = args
        const appointments = await ctx.db
            .query('appointments')
            .filter(q => q.eq(q.field('tenantId'), tenantId) && q.eq(q.field('id'), appointmentId))
            .collect()
        return appointments.length
    },
});