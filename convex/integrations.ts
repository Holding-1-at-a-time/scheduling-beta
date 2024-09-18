// convex/integrations.ts
import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { ConvexError } from "convex/values";
import { getTenantId } from "./permissions";
import { paginationOptsValidator } from "./utils";

export const list = query({
    args: {
        paginationOpts: paginationOptsValidator,
    },
    handler: async (ctx, args) => {
        const tenantId = await getTenantId(ctx);
        const { skip, take } = args.paginationOpts;

        try {
            const integrations = await ctx.db
                .query("integrations")
                .withIndex("byTenantId", q => q.eq("tenantId", tenantId))
                .order("desc")
                .collect();

            const paginatedIntegrations = integrations.slice(skip, skip + take);
            const totalCount = integrations.length;

            ctx.logger.info("Integrations listed", { tenantId, skip, take });

            return {
                integrations: paginatedIntegrations,
                totalCount,
                hasMore: skip + take < totalCount,
            };
        } catch (error) {
            ctx.logger.error("Error listing integrations", { error, tenantId });
            throw new ConvexError("Failed to list integrations");
        }
    },
});

export const toggle = mutation({
    args: {
        integrationId: v.id("integrations"),
        isConnected: v.boolean(),
    },
    handler: async (ctx, args) => {
        const tenantId = await getTenantId(ctx);

        try {
            const integration = await ctx.db.get(args.integrationId);
            if (!integration || integration.tenantId !== tenantId) {
                throw new ConvexError("Integration not found or not associated with this tenant");
            }

            await ctx.db.patch(args.integrationId, { isConnected: args.isConnected });

            ctx.logger.info("Integration toggled", {
                tenantId,
                integrationId: args.integrationId,
                isConnected: args.isConnected
            });

            return { success: true };
        } catch (error) {
            ctx.logger.error("Error toggling integration", { error, tenantId, integrationId: args.integrationId });
            throw new ConvexError("Failed to toggle integration");
        }
    },
});

export const getIntegrationDetails = query({
    args: { integrationId: v.id("integrations") },
    handler: async (ctx, args) => {
        const tenantId = await getTenantId(ctx);

        try {
            const integration = await ctx.db.get(args.integrationId);
            if (!integration || integration.tenantId !== tenantId) {
                throw new ConvexError("Integration not found or not associated with this tenant");
            }

            ctx.logger.info("Integration details fetched", { tenantId, integrationId: args.integrationId });

            return integration;
        } catch (error) {
            ctx.logger.error("Error fetching integration details", { error, tenantId, integrationId: args.integrationId });
            throw new ConvexError("Failed to fetch integration details");
        }
    },
});