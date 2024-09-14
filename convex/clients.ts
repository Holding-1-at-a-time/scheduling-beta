import { mutation, query } from './_generated/server'
import { v } from 'convex/values'
import { Id } from './_generated/dataModel'

export const list = query({
    args: { tenantId: v.id('tenants'), page: v.number(), pageSize: v.number() },
    handler: async (ctx, args) => {
        const { tenantId, page, pageSize } = args
        const skip = (page - 1) * pageSize

        const clients = await ctx.db
            .query('clients')
            .filter(q => q.eq(q.field('tenantId'), tenantId))
            .order('desc')
            .paginate({ numItems: pageSize, cursor: skip.toString() })

        return clients.page
    },
})

export const add = mutation({
    args: {
        tenantId: v.id('tenants'),
        name: v.string(),
        email: v.string(),
        phone: v.string(),
    },
    handler: async (ctx, args) => {
        const { tenantId, name, email, phone } = args
        const newClient = await ctx.db.insert('clients', { tenantId, name, email, phone })
        return newClient
    },
})

export const update = mutation({
    args: {
        id: v.id('clients'),
        name: v.optional(v.string()),
        email: v.optional(v.string()),
        phone: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const { id, ...updateData } = args
        const updatedClient = await ctx.db.patch(id, updateData)
        return updatedClient
    },
})

export const remove = mutation({
    args: { id: v.id('clients') },
    handler: async (ctx, args) => {
        const { id } = args
        await ctx.db.delete(id)
    },
})