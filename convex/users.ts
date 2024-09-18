// convex/users.ts
import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getTenantId } from "./auth";


export const upsertUser = mutation({
    args: {
        user: v.id('users'),
    },
    handler: async (ctx, args) => {
        const { clerkUserId } = args.user;
        const existingUser = await ctx.db
            .query("users")
            .withIndex("by_clerk_user_id", (q) => q.eq("clerkUserId", clerkUserId))
            .first();

        if (existingUser) {
            return await ctx.db.patch(existingUser._id, args.user);
        } else {
            return await ctx.db.insert("users", args.user);
        }
    },
});

export const getUser = query({
    args: { clerkUserId: v.string() },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("users")
            .withIndex("by_clerk_user_id", (q) => q.eq("clerkUserId", args.clerkUserId))
            .first();
    },
});

export const updateUserOrganizations = mutation({
    args: {
        clerkUserId: v.string(),
        organizations: v.array(v.object(users.organizations.element))
    },
    handler: async (ctx, args) => {
        const user = await ctx.db
            .query("users")
            .withIndex("by_clerk_user_id", (q) => q.eq("clerkUserId", args.clerkUserId))
            .first();

        if (!user) {
            throw new Error("User not found");
        }

        return await ctx.db.patch(user._id, {
            organizations: args.organizations
        });
    },
});

export const getUserOrganizations = query({
    args: { clerkUserId: v.string() },
    handler: async (ctx, args) => {
        const user = await ctx.db
            .query("users")
            .withIndex("by_clerk_user_id", (q) => q.eq("clerkUserId", args.clerkUserId))
            .first();

        if (!user) {
            throw new Error("User not found");
        }

        return user.organizations;
    },
});

export const upsertOrganization = mutation({
    args: {
        organization: v.object(organizations)
    },
    handler: async (ctx, args) => {
        const { id, ...orgData } = args.organization;
        const existingOrg = await ctx.db.get(id);

        if (existingOrg) {
            return await ctx.db.patch(id, orgData);
        } else {
            return await ctx.db.insert("organizations", args.organization);
        }
    },
});

export const getCurrentUser = query({
    args: {},
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("Not authenticated");
        }
        const user = await ctx.db
            .query("users")
<<<<<<< HEAD
            .withIndex("by_email", (q) => q.eq("email", identity.email))
=======
            .withIndex("by_tenant", (q) => q.eq("tenantId", identity.tenantId))
>>>>>>> development
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