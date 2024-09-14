// convex/advancedSettings.ts
import { query, mutation, action } from "./_generated/server";
import { v } from "convex/values";
import { ConvexError } from "convex/values";
import { getTenantId } from "./permissions";

export const get = query({
    args: {},
    handler: async (ctx) => {
        const tenantId = await getTenantId(ctx);
        const settings = await ctx.db
            .query("advancedSettings")
            .withIndex("byTenantId", q => q.eq("tenantId", tenantId))
            .first();

        if (!settings) {
            return null;
        }

        ctx.logger.info("Advanced settings fetched", { tenantId });
        return settings;
    },
});

export const update = mutation({
    args: {
        settings: v.object({
            dataRetention: v.string(),
            defaultTimezone: v.string(),
            defaultLanguage: v.string(),
        }),
    },
    handler: async (ctx, args) => {
        const tenantId = await getTenantId(ctx);
        const existingSettings = await ctx.db
            .query("advancedSettings")
            .withIndex("byTenantId", q => q.eq("tenantId", tenantId))
            .first();

        try {
            if (existingSettings) {
                await ctx.db.patch(existingSettings._id, args.settings);
            } else {
                await ctx.db.insert("advancedSettings", {
                    tenantId,
                    ...args.settings,
                });
            }
            ctx.logger.info("Advanced settings updated", { tenantId });
        } catch (error) {
            ctx.logger.error("Error updating advanced settings", { error, tenantId });
            throw new ConvexError("Failed to update settings");
        }
    },
});

export const exportData = action({
    args: {},
    handler: async (ctx) => {
        const tenantId = await getTenantId(ctx);
        try {
            const [users, appointments, services] = await Promise.all([
                ctx.runQuery("users.list", { tenantId }),
                ctx.runQuery("appointments.list", { tenantId }),
                ctx.runQuery("services.list", { tenantId }),
            ]);

            const exportData = {
                users,
                appointments,
                services,
                exportDate: new Date().toISOString(),
            };

            // In a real-world scenario, you'd upload this to a secure storage service
            // and return a download URL. For this example, we're returning the data directly.
            ctx.logger.info("Data exported", { tenantId });
            return JSON.stringify(exportData);
        } catch (error) {
            ctx.logger.error("Error exporting data", { error, tenantId });
            throw new ConvexError("Failed to export data");
        }
    },
});