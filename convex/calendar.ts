// convex/calendar.ts

import { query, mutation } from './_generated/server'
import { v } from 'convex/values'
import { Id } from './_generated/dataModel'

// Define the Event type
interface Event {
    _id: Id<'events'>
    title: string
    start: string // ISO date string
    end: string // ISO date string
    allDay: boolean
    description?: string
    color?: string
}

// Query to fetch events for a specific date range
export const getEvents = query({
    args: {
        tenantId: v.id('tenants'),
        start: v.string(),
        end: v.string(),
    },
    handler: async (ctx, args) => {
        const { tenantId, start, end } = args
        const events = await ctx.db
            .query('events')
            .filter(q =>
                q.eq(q.field('tenantId'), tenantId) &&
                q.gte(q.field('start'), start) &&
                q.lte(q.field('end'), end)
            )
            .collect()
        return events as Event[]
    },
})

// Mutation to add a new event
export const addEvent = mutation({
    args: {
        tenantId: v.id('tenants'),
        title: v.string(),
        start: v.string(),
        end: v.string(),
        allDay: v.boolean(),
        description: v.optional(v.string()),
        color: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const { tenantId, ...eventData } = args
        const eventId = await ctx.db.insert('events', { tenantId, ...eventData })
        return eventId
    },
})

// Mutation to update an existing event
export const updateEvent = mutation({
    args: {
        eventId: v.id('events'),
        title: v.optional(v.string()),
        start: v.optional(v.string()),
        end: v.optional(v.string()),
        allDay: v.optional(v.boolean()),
        description: v.optional(v.string()),
        color: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const { eventId, ...updateData } = args
        const updatedEvent = await ctx.db.patch(eventId, updateData)
        return updatedEvent
    },
})

// Mutation to delete an event
export const deleteEvent = mutation({
    args: {
        eventId: v.id('events'),
    },
    handler: async (ctx, args) => {
        const { eventId } = args
        await ctx.db.delete(eventId)
    },
})