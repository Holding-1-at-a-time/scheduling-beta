// convex/users.ts
import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getTenantId } from "./auth";

export const getCurrentUser = query({
    args: {},
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("Not authenticated");
        }
        const user = await ctx.db
            .query("users")
            .withIndex("by_email", (q) => q.eq("email", identity.email))
            .first();
        if (!user) {
            throw new Error("User not found");
        }
        return {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
        };
    },
});

export const updateUserRole = mutation({
    args: {
        userId: v.id("users"),
        newRole: v.string(),
    },
    handler: async (ctx, args) => {
        const tenantId = await getTenantId(ctx);
        const user = await ctx.db.get(args.userId);
        if (!user || user.tenantId !== tenantId) {
            throw new Error("User not found or not in your organization");
        }
        await ctx.db.patch(args.userId, { role: args.newRole });
    },
});