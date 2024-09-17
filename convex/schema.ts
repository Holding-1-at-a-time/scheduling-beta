// convex/schema.ts
// convex/schema.ts
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";


export default defineSchema({
    users: defineTable({
        userId: v.id("users"),
        tokenIdentifier: v.string(),
        tenantId: v.id('tenants'),
        email: v.string(),
        phone: v.optional(v.string()),
        clerkUserId: v.string(),
        externalId: v.optional(v.string()),
        firstName: v.string(),
        lastName: v.string(),
        fullName: v.string(),
        username: v.optional(v.string()),
        createdAt: v.number(),
        updatedAt: v.number(),
        primaryEmailAddress: v.string(),
        primaryPhoneNumber: v.optional(v.string()),
        primaryWeb3Wallet: v.optional(v.string()),
        emailVerified: v.boolean(),
        phoneNumberVerified: v.optional(v.boolean()),
        imageUrl: v.optional(v.string()),
        hasImage: v.boolean(),
        twoFactorEnabled: v.boolean(),
        publicMetadata: v.optional(v.any()),
        organizations: v.array(v.object({
            orgId: v.id("organizations"),
            role: v.string(),
            name: v.string(),
            slug: v.string(),
            imageUrl: v.optional(v.string()),
            hasImage: v.boolean(),
            permissions: v.array(v.string()),
            publicMetadata: v.optional(v.any()),
        }))
    })
        .index("by_token", ["tokenIdentifier"])
        .index("by_clerkUserId", ["clerkUserId"])
        .index("by_primaryEmailAddress", ["primaryEmailAddress"]),



    organizations: defineTable({
        organizationId: v.id("organizations"),
        tenantId: v.id('tenants'),
        name: v.string(),
        description: v.string(),
        imageUrl: v.optional(v.string()),
        hasImage: v.boolean(),
        publicMetadata: v.optional(v.any()),
        permissions: v.array(v.string()),
        slug: v.string(),
    })
        .index("by_tenant_and_name", ["tenantId", "name"])
        .index("by_tenant_and_description", ["tenantId", "description"])
        .index("by_tenant_and_slug", ["tenantId", "slug"])
        .index("by_tenant_and_imageUrl", ["tenantId", "imageUrl"])
        .index("by_tenant_and_hasImage", ["tenantId", "hasImage"])
        .index("by_tenant_and_publicMetadata", ["tenantId", "publicMetadata"]),

    tenants: defineTable({
        tenantId: v.id('tenants'),
        tenantName: v.string(),
        tenantEmail: v.string(),
        tenantPhone: v.string(),
        tenantAddress: v.array(v.object({
            city: v.string(),
            State: v.string(),
            Zip: v.string(),
        }))
    })
        .index("by_email", ["tenantEmail"])
        .index("by_phone", ["tenantPhone"])
        .index("by_name", ["tenantName"])
        .index("by_address", ["tenantAddress"]),

    clients: defineTable({
        tenantId: v.id('tenants'),
        name: v.string(),
        email: v.string(),
        phone: v.string(),
        address: v.string(),
        city: v.string(),
        state: v.string(),
        zip: v.string(),
    })
        .index("by_email", ["email"])
        .index("by_phone", ["phone"])
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
        .index("by_tenant_and_description", ["tenantId", "description"]),

    analytics: defineTable({
        tenantId: v.id('tenants'),
        date: v.number(),
        revenue: v.number(),
        completedServices: v.number(),
        newCustomers: v.number(),
        newAppointments: v.number(),
        newNoShows: v.number(),
        completedAppointments: v.number(),
        completedNoShows: v.number(),
        noShows: v.number(),
        appointments: v.number(),
        customers: v.number(),
        ratings: v.array(v.number()),
        availableSlots: v.array(v.number()),

    })
        .index("by_tenant_and_date", ["tenantId", "date"])
        .index("by_tenant_and_revenue", ["tenantId", "revenue"])
        .index("by_tenant_and_completedServices", ["tenantId", "completedServices"])
        .index("by_tenant_and_newCustomers", ["tenantId", "newCustomers"])
        .index("by_tenant_and_newAppointments", ["tenantId", "newAppointments"])
        .index("by_tenant_and_newNoShows", ["tenantId", "newNoShows"])
        .index("by_tenant_and_newAppointments", ["tenantId", "newAppointments"])
        .index("by_tenant_and_completedAppointments", ["tenantId", "completedAppointments"])
        .index("by_tenant_and_newAppointments", ["tenantId", "newAppointments"])
        .index("by_tenant_and_completedNoShows", ["tenantId", "completedNoShows"])
        .index("by_tenant_and_completedAppointments", ["tenantId", "completedAppointments"])
        .index("by_tenant_and_noShows", ["tenantId", "noShows"])
        .index("by_tenant_and_appointments", ["tenantId", "appointments"])
        .index("by_tenant_and_date", ["tenantId", "date"]),

    appointments: defineTable({
        appointmentId: v.id('appointments'),
        tenantId: v.id('tenants'),
        userId: v.id('users'),
        date: v.number(),
        time: v.number(),
        status: v.union(
            v.literal("scheduled"),
            v.literal("canceled"),
            v.literal("pending"),
            v.literal("completed"),
            v.literal("no_show"),
            v.literal("rescheduled"),
            v.literal("required"),
        ),
        details: v.string(),
        clientsId: v.id('clients'),
        serviceId: v.id('services'),
        serviceName: v.string(),
        servicePrice: v.number(),
        serviceDuration: v.number(),
        serviceDescription: v.string(),
        serviceImage: v.string(),
        clientName: v.string(),
        clientEmail: v.string(),
        clientPhone: v.string(),
        clientAddress: v.string(),
        clientCity: v.string(),
        clientState: v.string(),
        clientZip: v.string(),
    })
        .index("by_tenant_and_date", ["tenantId", "date"])
        .index("by_tenant_and_time", ["tenantId", "time"])
        .index("by_date_clientName_serviceName_time", ["date", "clientName", "serviceName", "time"])
        .index("by_appointment_clientName", ["appointmentId", "clientName"])
        .index("by_tenant_and_date", ["tenantId", "date"]),

    availableSlots: defineTable({
        tenantId: v.id('tenants'),
        userId: v.id('users'),
        serviceId: v.id('services'),
        customerId: v.string(),
        date: v.number(),
        isAvailable: v.boolean(),
    })
        .index("by_tenant_and_date", ["tenantId", "date"]),

    vehicleParts: defineTable({
        tenantId: v.id('tenants'),
        vehicleId: v.id("vehicles"),
        part: v.string(),
        price: v.number(),
        name: v.string(),
        x: v.number(),
        y: v.number(),
    }),

    assessments: defineTable({
        vehicleId: v.id("vehicles"),
        assessment: v.array(v.object({ part: v.string(), issue: v.string() })),
        tenantId: v.string(),
        clientId: v.string(),
        date: v.number(),
        rating: v.number(),
        description: v.string(),
        image: v.string(),
        name: v.string(),
        phone: v.string(),
        email: v.string(),
        address: v.string(),
        city: v.string(),
        state: v.string(),
        zip: v.string(),
        status: v.string(),
        price: v.number(),
        service: v.string(),
        serviceId: v.string(),
        servicePrice: v.number(),
        serviceDuration: v.number(),
        serviceDescription: v.string(),
    })
        .index("by_vehicleId", ["vehicleId"]),

    vehicles: defineTable({
        tenantId: v.id('tenants'),
        clientId: v.id('clients'),
        clientName: v.string(),
        vehicleId: v.id("vehicles"),
        make: v.string(),
        model: v.string(),
        year: v.number(),
        bodyType: v.string(),
        image: v.string(),
        vin: v.string(),
        date: v.number(),
    })
        .index("by_tenantId", ["tenantId"])
        .index("by_vin_and_tenantId", ["vin", "tenantId"]),


    vehiclesEmbeddings: defineTable({
        tenantId: v.id('tenants'),
        clientId: v.id('clients'),
        clientName: v.string(),
        vehicleId: v.id("vehicles"),
        make: v.string(),
        model: v.string(),
        year: v.number(),
        bodyType: v.string(),
        image: v.string(),
        VIN: v.string(),
        embedding: v.array(v.number()),
    })
        .vectorIndex("by_embedding", {
            vectorField: "embedding",
            dimensions: 1532,
            filterFields: ['clientName', 'vehicleId', 'VIN'],
        })
        .vectorIndex("by_tenantId_and_embedding", {
            vectorField: "tenantId",
            dimensions: 1532,
            filterFields: ["tenantId", "embedding"]
        }),

    analyticsEmbeddings: defineTable({
        tenantId: v.id('tenants'),
        date: v.number(),
        revenue: v.number(),
        completedServices: v.number(),
        newCustomers: v.number(),
        newAppointments: v.number(),
        newNoShows: v.number(),
        completedAppointments: v.number(),
        completedNoShows: v.number(),
        noShows: v.number(),
        appointments: v.number(),
        customers: v.number(),
        ratings: v.array(v.number()),
        availableSlots: v.array(v.number()),
        embedding: v.array(v.number()),
    })
        .vectorIndex("embedding_index", {
            vectorField: "embedding",
            dimensions: 1532,
            filterFields: [
                'tenantId',
                'date',
                'revenue',
                'completedServices',
                'newCustomers',
                'newAppointments',
                'newNoShows',
                'completedAppointments',
                'completedNoShows',
                'noShows',
                'appointments',
                'customers',
                'ratings',
                'availableSlots',
            ],
        })
        .index("by_tenant_and_date", ["tenantId", "date"])
        .index("by_revenue", ["revenue"])
        .index("by_new_customers", ["newCustomers"])
        .index("by_new_appointments", ["newAppointments"]),
});
