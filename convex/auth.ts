
// convex/auth.ts
import { ConvexError, QueryCtx, MutationCtx, ActionCtx } from "convex/server";
import { Id } from "./_generated/dataModel";

export async function getTenantId(
    ctx: QueryCtx | MutationCtx | ActionCtx
): Promise<string> {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
        throw new ConvexError("Not authenticated");
    }
    const user = await ctx.db
        .query("users")
        .withIndex("by_email", (q) => q.eq("email", identity.email))
        .first();
    if (!user) {
        throw new ConvexError("User not found");
    }
    return user.tenantId;
}