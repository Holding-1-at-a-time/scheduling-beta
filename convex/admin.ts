// convex/admin.ts
import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { ConvexError, DatabaseReader } from "convex/server";

/**
 * Retrieves admin analytics data for a specific tenant.
 * 
 * @returns {Promise<object>} An object containing users, appointments, services, and analytics data.
 */
export const getAdminAnalytics = query({
    args: {},
    handler: async (ctx) => {
        const tenantId = await getTenantId(ctx);

        // Define database queries
        const queries = [
            getUsersQuery(ctx, tenantId),
            getAppointmentsQuery(ctx, tenantId),
            getServicesQuery(ctx, tenantId),
            getAnalyticsQuery(ctx, tenantId),
        ];

        // Execute queries concurrently
        const [users, appointments, services, analytics] = await Promise.all(queries);

        // Return the collected data
        return { users, appointments, services, analytics };
    },
});

// Define individual query functions for better readability and maintainability
function getUsersQuery(ctx, tenantId) {
    return ctx.db
        .query("users")
        .withIndex("by_tenant", (q) => q.eq("tenantId", tenantId))
        .collect();
}

function getAppointmentsQuery(ctx, tenantId) {
    return ctx.db
        .query("appointments")
        .withIndex("by_tenant_and_date", (q) => q.eq("tenantId", tenantId))
        .order("desc")
        .take(100);
}

function getServicesQuery(ctx, tenantId) {
    return ctx.db
        .query("services")
        .withIndex("by_tenant", (q) => q.eq("tenantId", tenantId))
        .collect();
}

function getAnalyticsQuery(ctx, tenantId) {
    return ctx.db
        .query("analytics")
        .withIndex("by_tenant_and_date", (q) => q.eq("tenantId", tenantId))
        .order("desc");
}

export const getUsers = query({
    args: { tenantId: v.string() },
    handler: async (ctx, args) => {
        // ... existing implementation ...
    },
});

export const getClients = query({
    args: { tenantId: v.string() },
    handler: async (ctx, args) => {
        // ... existing implementation ...
    },
});

export const getEmployees = query({
    args: { tenantId: v.string() },
    handler: async (ctx, args) => {
        // ... existing implementation ...
    },
});

export const getServices = query({
    args: { tenantId: v.string() },
    handler: async (ctx, args) => {
        // ... existing implementation ...
    },
});