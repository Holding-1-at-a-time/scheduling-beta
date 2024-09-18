import { mutation } from './_generated/server'
import { v } from 'convex/values'
import { TableNamesInDataModel } from './_generated/dataModel'

export const saveSignUpData = mutation({
    args: {
      name: v.string(),
      email: v.string(),
      business: v.string(),
      size: v.union(v.literal('solo'), v.literal('small'), v.literal('medium'), v.literal('large')),
      interests: v.union(v.literal('scheduling'), v.literal('customer'), v.literal('notifications'), v.literal('integration'), v.literal('analytics'), v.literal('security')),
      message: v.optional(v.string()),
      terms: v.boolean(),
    },
    handler: async (ctx, args) => {
        const { name, email, business, size, interests, message, terms } = args;
        const signUpData = { name, email, business, size, interests, message, terms };
        await ctx.db.insert('signUpData', signUpData);
        return signUpData;
    }
});

