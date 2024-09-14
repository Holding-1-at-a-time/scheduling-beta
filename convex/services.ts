// convex/services.ts
import { mutation, query } from './_generated/server'
import { v } from 'convex/values'


export const listServices = query({
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

export const addServices = mutation({
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

export const updateServices = mutation({
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

export const removeServices = mutation({
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
});

