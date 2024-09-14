// convex/schema.ts
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    users: defineTable({
        tenantId: v.id('tenants'),
        name: v.string(),
        email: v.string(),
        role: v.string(),
        phone: v.string(),
        password: v.string(),
    })
        .index("by_tenant", ['tenantId'])
        .index("by_tenant_and_name", ["tenantId", "name"])
        .index("by_tenant_and_role", ["tenantId", "role"])
        .index("by_email", ["email"])
        .index("by_tenant_and_email", ["tenantId", "email"])
        .index("by_tenant_and_phone", ["tenantId", "phone"]),


    tenants: defineTable({
        tenantId: v.id('tenants'),
        name: v.string(),
        email: v.string(),
        phone: v.string(),
        address: v.string(),
        city: v.string(),
        state: v.string(),
        zip: v.string(),
    }).index("by_email", ["email"])
        .index("by_phone", ["phone"])
        .index("by_tenantId", ["tenantId"])
        .index("by_name", ["name"])
        .index("by_address", ["address", "city", "state", "zip"]),

    services: defineTable({
        tenantId: v.id('tenants'),
        name: v.string(),
        price: v.number(),
        duration: v.number(),
        description: v.string(),
        image: v.string(),
    })
        .index("by_tenant_and_name", ["tenantId", "name"])
        .index("by_tenant_and_duration", ["tenantId", "duration"])
        .index("by_tenant_and_price", ["tenantId", "price"])
        .index("by_tenant_and_description", ["tenantId", "description"])
        .index("by_tenant", ["tenantId"]),

    analytics: defineTable({
        tenantId: v.id('tenants'),
        date: v.number(),
        revenue: v.number(),
        completedServices: v.number(),
        noShows: v.number(),
        ratings: v.array(v.number()),
    }).index("by_tenant_and_date", ["tenantId", "date"]),

    appointments: defineTable({
        tenantId: v.id('tenants'),
        userId: v.id('users'),
        date: v.number(),
        status: v.string(),
        details: v.string(),
        customerId: v.string(),
        serviceId: v.string(),
    }).index("by_tenant_and_date", ["tenantId", "date"]),

    availableSlots: defineTable({
        tenantId: v.id('tenants'),
        userId: v.id('users'),
        serviceId: v.id('services'),
        customerId: v.string(),
        date: v.number(),
        isAvailable: v.boolean(),
    }).index("by_tenant_and_date", ["tenantId", "date"]),

    vehicleParts: defineTable({
        name: v.string(),
        x: v.number(),
        y: v.number(),
    }),

    assessments: defineTable({
        vehicleId: v.id("vehicles"),
        assessment: v.array(v.object({ part: v.string(), issue: v.string() })),
        tenantId: v.string(),
    }).index("by_vehicleId", ["vehicleId"]),

    vehicles: defineTable({
        make: v.string(),
        model: v.string(),
        year: v.number(),
        image: v.string(),
        vin: v.string(),
        tenantId: v.string(),
    }).index("by_tenantId", ["tenantId"])
        .index("by_vin_and_tenantId", ["vin", "tenantId"]),


    vehiclesEmbeddings: defineTable({
        tenantId: v.id('tenants'),
        clientId: v.id('clients'),
        clientName: v.string(),
        vehicleId: v.id("vehicles"),
        make: v.string(),
        model: v.string(),
        year: v.number(),
        image: v.string(),
        vin: v.string(),
        embedding: v.array(v.number()),
    })
        .index("by_embedding", ["embedding"])
        .index("by_tenantId_and_embedding", ["tenantId", "embedding"]),
});