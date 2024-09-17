// convex/profile.ts
import { mutation, query } from './_generated/server'
import { v } from 'convex/values'

export const get = query({
    args: {},
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity()
        if (!identity) throw new Error('Unauthenticated')

        const userId = identity.subject

        return await ctx.db
            .query('profiles')
            .filter(q => q.eq(q.field('userId'), userId))
            .first()
    },
})

export const update = mutation({
    args: {
        businessName: v.string(),
        description: v.string(),
        phone: v.string(),
        email: v.string(),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity()
        if (!identity) throw new Error('Unauthenticated')

        const userId = identity.subject

        const existingProfile = await ctx.db
            .query('profiles')
            .filter(q => q.eq(q.field('userId'), userId))
            .first()

        if (existingProfile) {
            return await ctx.db.patch(existingProfile._id, args)
        } else {
            return await ctx.db.insert('profiles', { userId, ...args })
        }
    },
})
