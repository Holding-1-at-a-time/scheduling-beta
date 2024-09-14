import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { ConvexError } from "convex/values";

/**
 * Returns all available slots for a given date
 *
 * @param args.date the date to retrieve available slots for
 * @returns an array of available slots, where each slot is an object with an id and time
 */
export const getAvailableSlots = query ({
    args: { date: v.string() },
    handler: async (ctx, { date }: { date: string }) => {
        const { tenantId } = await ctx.auth.getUserIdentity() ?? {};
        if (!tenantId) {
            throw new ConvexError("Unauthorized");
        }

        const slots = await ctx.db
            .query("availableSlots")
            .withIndex("by_tenantId_and_date", (q) =>
                q.eq("tenantId", tenantId).eq("date", date)
            )
            .collect();

        return slots.map(slot => ({
            id: slot._id,
            time: slot.time,
        }));
    },
});
export const bookAppointment = mutation({
    args: {
        date: v.string(),
        slotId: v.id("availableSlots"),
        clientName: v.string(),
        clientEmail: v.string(),
    },
    handler: async (ctx, args) => {
        const { tenantId } = await ctx.auth.getUserIdentity() ?? {};
        if (!tenantId) {
            throw new ConvexError("Unauthorized");
        }

        const slot = await ctx.db.get(args.slotId);
        if (!slot || slot.tenantId !== tenantId) {
            throw new ConvexError("Invalid slot");
        }

        if (slot.isBooked) {
            throw new ConvexError("Slot already booked");
        }

        const appointment = await ctx.db.insert("appointments", {
            tenantId,
            date: args.date,
            time: slot.time,
            clientName: args.clientName,
            clientEmail: args.clientEmail,
        });

        await ctx.db.patch(args.slotId, { isBooked: true });

        return appointment;
    },
});