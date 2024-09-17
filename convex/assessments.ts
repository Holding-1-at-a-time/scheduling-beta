import { mutation } from './_generated/server'
import { v } from 'convex/values'

export const addConditionDetail = mutation({
    args: {
        tenantId: v.id('tenants'),
        hotspotId: v.id('vehicleParts'),
        issueType: v.string(),
        severity: v.string(),
    },
    handler: async (ctx, args) => {
        const { tenantId, hotspotId, issueType, severity } = args
        return await ctx.db.insert('conditionDetails', {
                    tenantId,
                    hotspotId,
                    issueType,
                    severity,
                    createdAt: new Date().toISOString(),
                });

    },
})