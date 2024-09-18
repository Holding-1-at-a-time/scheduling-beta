import { mutation, query } from './_generated/server'
import { v } from 'convex/values'
import { MutationCtx, QueryCtx } from './_generated/server'
import { Doc, Id } from './_generated/dataModel'

interface AddClientArgs {
    tenantId: Id<'tenants'>;
    name: string;
    email: string;
    phone: string;
}

interface ClientDoc extends Omit<AddClientArgs, 'tenantId'> {
    tenantId: Id<'tenants'>;
    city: string;
    address: string;
    state: string;
    zip: string;
}

interface ListClientsArgs {
    tenantId: Id<'tenants'>;
    page: number;
    pageSize: number;
}

interface UpdateClientArgs {
    id: Id<'clients'>;
    name?: string;
    email?: string;
    phone?: string;
}

export const list = query({
    args: { tenantId: v.id('tenants'), page: v.number(), pageSize: v.number() },
    handler: async (ctx: QueryCtx, args: ListClientsArgs) => {
        const { tenantId, page, pageSize } = args;
        const skip = (page - 1) * pageSize;

        const clients = await ctx.db
            .query('clients')
            .filter(q => q.eq(q.field('tenantId'), tenantId))
            .order('desc')
            .paginate({ numItems: pageSize, cursor: skip.toString() });

        return clients.page;
    },
});

export const add = mutation({
    args: {
        tenantId: v.id('tenants'),
        name: v.string(),
        email: v.string(),
        phone: v.string(),
    },
    handler: async (ctx: MutationCtx, args: AddClientArgs): Promise<Id<'clients'>> => {
        const { tenantId, name, email, phone } = args;
        const newClient: ClientDoc = {
            tenantId,
            name,
            email,
            phone,
            city: '',
            address: '',
            state: '',
            zip: ''
        };
        return await ctx.db.insert('clients', newClient);
    },
});

export const update = mutation({
    args: {
        id: v.id('clients'),
        name: v.optional(v.string()),
        email: v.optional(v.string()),
        phone: v.optional(v.string()),
    },
    handler: async (ctx: MutationCtx, args: UpdateClientArgs): Promise<void> => {
        const { id, ...updateData } = args;
        await ctx.db.patch(id, updateData);
    },
});

export const remove = mutation({
    args: { id: v.id('clients') },
    handler: async (ctx: MutationCtx, args: { id: Id<'clients'> }): Promise<void> => {
        const { id } = args;
        await ctx.db.delete(id);
    },
});