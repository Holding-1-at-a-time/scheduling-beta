// convex/services.ts
import { mutation, query } from './_generated/server'
import { v } from 'convex/values'

export const list = query({
    args: {},
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity()
        if (!identity) throw new Error('Unauthenticated')

        const userId = identity.subject

        return await ctx.db
            .query('services')
            .filter(q => q.eq(q.field('userId'), userId))
            .collect()
    },
})

export const add = mutation({
    args: {
        name: v.string(),
        description: v.string(),
        price: v.number(),
        duration: v.number(),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity()
        if (!identity) throw new Error('Unauthenticated')

        const userId = identity.subject

        return await ctx.db.insert('services', { userId, ...args })
    },
})

export const update = mutation({
    args: {
        id: v.id('services'),
        name: v.string(),
        description: v.string(),
        price: v.number(),
        duration: v.number(),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity()
        if (!identity) throw new Error('Unauthenticated')

        const { id, ...updateData } = args

        const existingService = await ctx.db.get(id)
        if (!existingService || existingService.userId !== identity.subject) {
            throw new Error('Unauthorized or service not found')
        }

        return await ctx.db.patch(id, updateData)
    },
})

export const remove = mutation({
    args: { id: v.id('services') },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity()
        if (!identity) throw new Error('Unauthenticated')

        const existingService = await ctx.db.get(args.id)
        if (!existingService || existingService.userId !== identity.subject) {
            throw new Error('Unauthorized or service not found')
        }

        await ctx.db.delete(args.id)
    },
})


export const listServices = query({
    args: {},
    handler: async (ctx) => {
        const tenantId = await getTenantId(ctx);
        const services = await ctx.db
            .query("services")
            .withIndex("by_tenant", (q) => q.eq("tenantId", tenantId))
            .collect();
        return services.map(service => ({
            id: service._id,
            name: service.name,
            price: service.price,
            duration: service.duration,
        }));
    },
});

export const addService = mutation({
    args: {
        name: v.string(),
        price: v.number(),
        duration: v.number(),
    },
    handler: async (ctx, args) => {
        const tenantId = await getTenantId(ctx);
        const serviceId = await ctx.db.insert("services", {
            tenantId,
            name: args.name,
            price: args.price,
            duration: args.duration,
        });
        return serviceId;
    },
});

export const updateService = mutation({
    args: {
        serviceId: v.id("services"),
        name: v.optional(v.string()),
        price: v.optional(v.number()),
        duration: v.optional(v.number()),
    },
    handler: async (ctx, args) => {
        const tenantId = await getTenantId(ctx);
        const { serviceId, ...updates } = args;
        const service = await ctx.db.get(serviceId);
        if (!service || service.tenantId !== tenantId) {
            throw new Error("Service not found or not in your organization");
        }
        await ctx.db.patch(serviceId, updates);
    },
});