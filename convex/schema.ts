// convex/schema.ts
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    users: defineTable({
        name: v.string(),
        email: v.string(),
        role: v.string(),
        tenantId: v.string(),
    }).index("by_tenant", ["tenantId"]),

    services: defineTable({
        tenantId: v.string(),
        name: v.string(),
        price: v.number(),
        duration: v.number(),
    }).index("by_tenant", ["tenantId"]),

    analytics: defineTable({
        tenantId: v.string(),
        date: v.number(),
        revenue: v.number(),
        completedServices: v.number(),
        noShows: v.number(),
        ratings: v.array(v.number()),
    }).index("by_tenant_and_date", ["tenantId", "date"]),

    appointments: defineTable({
        tenantId: v.string(),
        userId: v.id('users'),
        date: v.number(),
        status: v.string(),
        details: v.string(),
        customerId: v.string(),
        serviceId: v.string(),
    }).index("by_tenant_and_date", ["tenantId", "date"]),

    availableSlots: defineTable({
        tenantId: v.string(),
        date: v.number(),
        isAvailable: v.boolean(),
    }).index("by_tenant_and_date", ["tenantId", "date"]),
});