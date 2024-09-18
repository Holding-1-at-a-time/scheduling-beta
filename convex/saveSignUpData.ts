import { mutation } from './_generated/server';
import { v } from 'convex/values';
import { Doc, Id } from './_generated/dataModel';

type BusinessSize = 'solo' | 'small' | 'medium' | 'large';
type Interest = 'scheduling' | 'customer' | 'notifications' | 'integration' | 'analytics' | 'security';

interface SignUpData {
  name: string;
  email: string;
  business: string;
  size: BusinessSize;
  interests: Interest;
  message?: string;
  terms: boolean;
}

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
  handler: async (ctx, args: SignUpData): Promise<Doc<'signUpData'>> => {
    const { name, email, business, size, interests, message, terms } = args;
    const signUpData: SignUpData = { name, email, business, size, interests, message, terms };
    const insertedId: Id<'signUpData'> = await ctx.db.insert('signUpData', signUpData);
    return { ...signUpData, _id: insertedId, _creationTime: Date.now() };
  }
});
