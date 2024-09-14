import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { ConvexError } from "convex/values";

export const getUploadUrl = mutation({
    args: {
        contentType: v.string(),
    },
    handler: async (ctx, args) => {
        const { tenantId } = await ctx.auth.getUserIdentity() ?? {};
        if (!tenantId) {
            throw new ConvexError("Unauthorized");
        }

        return await ctx.storage.generateUploadUrl({
            contentType: args.contentType,
            metadata: { tenantId },
        });
    },
});

export const saveImageUrl = mutation({
    args: {
        storageId: v.id("_storage"),
    },
    handler: async (ctx, args) => {
        const { tenantId } = await ctx.auth.getUserIdentity() ?? {};
        if (!tenantId) {
            throw new ConvexError("Unauthorized");
        }

        const imageUrl = await ctx.storage.getUrl(args.storageId);
        if (!imageUrl) {
            throw new ConvexError("Failed to get image URL");
        }

        const imageDoc = await ctx.db.insert("images", {
            tenantId,
            storageId: args.storageId,
            url: imageUrl,
        });

        return imageDoc;
    },
});

export const deleteImage = mutation({
    args: {
        storageId: v.id("_storage"),
    },
    handler: async (ctx, args) => {
        const { tenantId } = await ctx.auth.getUserIdentity() ?? {};
        if (!tenantId) {
            throw new ConvexError("Unauthorized");
        }

        const image = await ctx.db
            .query("images")
            .withIndex("by_storageId", (q) => q.eq("storageId", args.storageId))
            .unique();

        if (!image || image.tenantId !== tenantId) {
            throw new ConvexError("Image not found or unauthorized");
        }

        await ctx.storage.delete(args.storageId);
        await ctx.db.delete(image._id);
    },
});

export const getImages = query({
    handler: async (ctx) => {
        const { tenantId } = await ctx.auth.getUserIdentity() ?? {};
        if (!tenantId) {
            throw new ConvexError("Unauthorized");
        }

        return await ctx.db
            .query("images")
            .withIndex("by_tenantId", (q) => q.eq("tenantId", tenantId))
            .collect();
    },
});