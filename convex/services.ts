// convex/services.ts
import { mutation, query } from './_generated/server'
import { v } from 'convex/values'
import { getTenantId } from './auth'
import { Id } from './_generated/dataModel'

interface ServiceData {
    tenantId: string;
    name: string;
    description: string;
    price: number;
    duration: number;
    image: string;
}

export const addService = mutation({
    args: {
        name: v.string(),
        description: v.string(),
        price: v.number(),
        duration: v.number(),
        image: v.string(),
    },
    handler: async (ctx, args): Promise<Id<'services'>> => {
        const identity = await ctx.auth.getUserIdentity()
        if (!identity) {
            throw new Error('Unauthenticated')
        }

        const tenantId = await getTenantId(ctx.db, identity);

        const serviceData: ServiceData = {
            tenantId,
            ...args,
        };

        return await ctx.db.insert('services', serviceData);
    },
})

export const updateService = mutation({
    args: {
        id: v.id('services'),
        name: v.optional(v.string()),
        description: v.optional(v.string()),
        price: v.optional(v.number()),
        duration: v.optional(v.number()),
        image: v.optional(v.string()),
    },
    handler: async (ctx, args): Promise<Id<'services'>> => {
        const identity = await ctx.auth.getUserIdentity()
        if (!identity) {
            throw new Error('Unauthenticated')
        }

        const { id, ...updateData } = args;

        const existingService = await ctx.db.get(id);
        if (!existingService || existingService.tenantId !== identity.subject) {
            throw new Error('Unauthorized or service not found')
        }

        const updatedService = await ctx.db.patch(id, updateData);
        if (!updatedService) {
            throw new Error('Failed to update service');
        }
        return updatedService;
    },
})

export const removeService = mutation({
    args: { id: v.id('services') },
    handler: async (ctx, args): Promise<void> => {
        const identity = await ctx.auth.getUserIdentity()
        if (!identity) {
            throw new Error('Unauthenticated')
        }

        const existingService = await ctx.db.get(args.id)
        if (!existingService || existingService.tenantId !== identity.subject) {
            throw new Error('Unauthorized or service not found')
        }

        await ctx.db.delete(args.id);
    },
})

interface ServiceListItem {
    id: Id<'services'>;
    name: string;
    price: number;
    duration: number;
}

export const listServices = query({
    args: {
        tenantId: v.id('tenants'),
        name: v.optional(v.string()),
        description: v.optional(v.string()),
        price: v.optional(v.number()),
        duration: v.optional(v.number()),
        image: v.optional(v.string()),
    },
    handler: async (ctx, args): Promise<ServiceListItem[]> => {
        const identity = await ctx.auth.getUserIdentity()
        if (!identity) {
            throw new Error('Unauthenticated')
        }
        const tenantId = await getTenantId(ctx, identity);
        const services = await ctx.db
            .query("services")
            .withIndex("by_tenant_and_name", (q) => q.eq("tenantId", tenantId))
            .collect();

        return services.map(service => ({
            id: service._id,
            name: service.name,
            price: service.price,
            duration: service.duration,
        }));
    },
});

export const createService = mutation({
    args: {
        tenantId: v.string(),
        name: v.string(),
        description: v.string(),
        price: v.number(),
        duration: v.number(),
        image: v.string(),
    },
    handler: async (ctx, args) => {
        const { tenantId, ...serviceData } = args;
        const serviceId = await ctx.db.insert("services", {
            tenantId: tenantId as Id<"tenants">,
            ...serviceData,
        });
        return serviceId;
    },
});

export const getServicesByTenant = query({
    args: { tenantId: v.string() },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("services")
            .withIndex("by_tenant_and_name", (q) => q.eq("tenantId", args.tenantId as Id<"tenants">))
            .collect();
    },
});