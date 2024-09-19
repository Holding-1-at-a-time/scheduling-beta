import { query, mutation, action } from "./_generated/server";
import { ConvexError } from "convex/values";
import { UserIdentity } from "convex/server";
import { DatabaseReader } from "./_generated/server";

import { Id } from "./_generated/dataModel";

export async function getTenantId(
  ctx: DatabaseReader,
  identity: UserIdentity
): Promise<Id<"tenants">> {
  const user = await ctx
    .query("users")
    .filter((q) => q.eq(q.field("tokenIdentifier"), identity.tokenIdentifier))
    .first();

  if (!user) {
    throw new Error("User not found");
  }

  return user.tenantId;
}

export const getUser = query(async (ctx) => {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    throw new ConvexError("Not authenticated");
  }

  const user = await ctx.db
    .query("users")
    .filter((q) => q.eq(q.field("email"), identity.email))
    .first();

  if (!user) {
    throw new ConvexError("User not found");
  }
  return {
    user
  }
});
