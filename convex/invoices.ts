import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { ConvexError } from "convex/values";

export const getInvoice = query({
    args: { invoiceId: v.id("invoices") },
    handler: async (ctx, args) => {
        const { tenantId } = await ctx.auth.getUserIdentity() ?? {};
        if (!tenantId) {
            throw new ConvexError("Unauthorized");
        }

        const invoice = await ctx.db.get(args.invoiceId);
        if (!invoice || invoice.tenantId !== tenantId) {
            throw new ConvexError("Invoice not found");
        }

        return invoice;
    },
});

export const updateInvoiceStatus = mutation({
    args: {
        invoiceId: v.id("invoices"),
        status: v.union(v.literal("unpaid"), v.literal("paid"), v.literal("overdue")),
    },
    handler: async (ctx, args) => {
        const { tenantId } = await ctx.auth.getUserIdentity() ?? {};
        if (!tenantId) {
            throw new ConvexError("Unauthorized");
        }

        const invoice = await ctx.db.get(args.invoiceId);
        if (!invoice || invoice.tenantId !== tenantId) {
            throw new ConvexError("Invoice not found");
        }

        await ctx.db.patch(args.invoiceId, { status: args.status });
    },
});