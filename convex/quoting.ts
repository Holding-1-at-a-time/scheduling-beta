import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { ConvexError } from "convex/values";

export const getVehicleDetails = mutation({
    args: { vin: v.string() },
    handler: async (ctx, args) => {
        // In a real-world scenario, this would call an external API to get vehicle details
        // For this example, we'll return mock data
        return {
            make: "Toyota",
            model: "Camry",
            year: 2020,
            type: "sedan",
        };
    },
});

export const getAIEstimate = mutation({
    args: {
        vehicleDetails: v.object({
            make: v.string(),
            model: v.string(),
            year: v.number(),
            type: v.string(),
        }),
        selectedServices: v.array(
            v.object({
                _id: v.string(),
                name: v.string(),
                price: v.number(),
                duration: v.number(),
            })
        ),
    },
    handler: async (ctx, args) => {
        // In a real-world scenario, this would use an AI model to generate estimates
        // For this example, we'll return mock data
        return args.selectedServices.map(service => ({
            serviceId: service._id,
            estimate: service.price * 1.1, // 10% increase as a simple "AI" estimate
        }));
    },
});