
// convex/admin.ts
import { query } from "./_generated/server";
import { getTenantId } from "./auth";

export const getAdminAnalytics = query({
    args: {},
    handler: async (ctx) => {
        const tenantId = await getTenantId(ctx);

        const [users, appointments, services, analytics] = await Promise.all([
            ctx.db
                .query("users")
                .withIndex("by_tenant", (q) => q.eq("tenantId", tenantId))
                .collect(),
            ctx.db
                .query("appointments")
                .withIndex("by_tenant_and_date", (q) => q.eq("tenantId", tenantId))
                .order("desc")
                .take(100),
            ctx.db
                .query("services")
                .withIndex("by_tenant", (q) => q.eq("tenantId", tenantId))
                .collect(),
            ctx.db
                .query("analytics")
                .withIndex("by_tenant_and_date", (q) => q.eq("tenantId", tenantId))
                .order("desc")
                .take(30),
        ]);

<<<<<<< HEAD
        const totalRevenue = analytics.reduce((sum, a) => sum + a.revenue, 0);
        const completedServices = analytics.reduce((sum, a) => sum + a.completedServices, 0);
        const noShowRate = analytics.reduce((sum, a) => sum + a.noShows, 0) / appointments.length;
        const averageRating = analytics.flatMap(a => a.ratings).reduce((sum, r) => sum + r, 0) /
            analytics.reduce((sum, a) => sum + a.ratings.length, 0);
=======
        const totalRevenue = analytics.reduce((sum, a) => sum  a.revenue, 0);
        const completedServices = analytics.reduce((sum, a) => sum  a.completedServices, 0);
        const noShowRate = analytics.reduce((sum, a) => sum  a.noShows, 0) / appointments.length;
        const averageRating = analytics.flatMap(a => a.ratings).reduce((sum, r) => sum  r, 0) /
            analytics.reduce((sum, a) => sum  a.ratings.length, 0);
>>>>>>> development

        return {
            metrics: {
                totalRevenue,
                completedServices,
                noShowRate,
                averageRating,
            },
            recentAppointments: appointments,
            userCount: users.length,
            serviceCount: services.length,
        };
    },
});