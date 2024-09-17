// convex/estimations.ts
import { mutation } from "./_generated/server";
import { v } from "convex/values";
import { getTenantId } from "./auth";

export const calculate = mutation({
    args: {
        vehicleDetails: v.object({
            make: v.string(),
            model: v.string(),
            year: v.number(),
            condition: v.string(),
        }),
        selectedServices: v.array(v.string()),
        customizations: v.object({
            rush: v.boolean(),
            eco: v.boolean(),
        }),
    },
    handler: async (ctx, args) => {
        const tenantId = await getTenantId(ctx);

        const services = await ctx.db
            .query("services")
            .withIndex("by_tenant", (q) => q.eq("tenantId", tenantId))
            .filter((q) => q.includes(q.field("name"), args.selectedServices))
            .collect();

        let totalPrice = services.reduce((sum, service) => sum  service.price, 0);

        // Apply customizations
        if (args.customizations.rush) totalPrice *= 1.2;
        if (args.customizations.eco) totalPrice *= 0.9;

        // Apply condition-based adjustments
        switch (args.vehicleDetails.condition) {
            case "poor":
                totalPrice *= 1.3;
                break;
            case "fair":
                totalPrice *= 1.1;
                break;
            case "excellent":
                totalPrice *= 0.9;
                break;
        }

        const detailedAnalysis = `Estimate for ${args.vehicleDetails.year} ${args.vehicleDetails.make} ${args.vehicleDetails.model}:
    Base price: $${totalPrice.toFixed(2)}
    Condition adjustment: ${args.vehicleDetails.condition}
    Rush job: ${args.customizations.rush ? "Yes" : "No"}
    Eco-friendly: ${args.customizations.eco ? "Yes" : "No"}
    Selected services: ${args.selectedServices.join(", ")}`;

        return {
            estimatedTotal: Math.round(totalPrice * 100) / 100,
            detailedAnalysis,
        };
    },
});