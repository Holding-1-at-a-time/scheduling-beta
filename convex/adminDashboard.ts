// convex/adminDashboard.ts
import { query } from "./_generated/server";
import { v } from "convex/values";
import { ConvexError } from "convex/values";
import { getPermissions } from "./permissions";

export const getDashboardStats = query({
    args: {},
    handler: async (ctx) => {
        try {
            const { user, permissions } = await getPermissions(ctx);
            if (!user || !permissions.includes("org:admin:access")) {
                throw new ConvexError("Not authorized");
            }

            const [totalUsers, totalOrganizations, activeAppointments] = await Promise.all([
                ctx.db.query("users").collect().then(users => users.length),
                ctx.db.query("organizations").collect().then(orgs => orgs.length),
                ctx.db.query("appointments")
                    .withIndex("byStatus", q => q.eq("status", "active"))
                    .collect()
                    .then(appointments => appointments.length)
            ]);

            ctx.logger.info("Admin dashboard stats fetched", { user: user._id });

            return {
                totalUsers,
                totalOrganizations,
                activeAppointments,
            };
        } catch (error) {
            ctx.logger.error("Error fetching admin dashboard stats", { error });
            throw new ConvexError("Failed to fetch dashboard stats");
        }
    },
});