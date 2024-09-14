// convex/quotes.ts
import { mutation } from './_generated/server'
import { v } from 'convex/values'

export const processQuote = mutation({
    args: {
        tenantId: v.id('tenants'),
        vehicleType: v.union(v.literal('sedan'), v.literal('suv'), v.literal('truck'), v.literal('van')),
        condition: v.union(v.literal('excellent'), v.literal('good'), v.literal('fair'), v.literal('poor')),
        images: v.array(v.string()),
    },
    handler: async (ctx, args) => {
        const { tenantId, vehicleType, condition, images } = args

        // Process the quote based on the provided information
        // This is a placeholder implementation
        let basePrice = 0
        switch (vehicleType) {
            case 'sedan':
                basePrice = 100
                break
            case 'suv':
                basePrice = 150
                break
            case 'truck':
                basePrice = 200
                break
            case 'van':
                basePrice = 180
                break
        }

        let conditionMultiplier = 1
        switch (condition) {
            case 'excellent':
                conditionMultiplier = 0.8
                break
            case 'good':
                conditionMultiplier = 1
                break
            case 'fair':
                conditionMultiplier = 1.2
                break
            case 'poor':
                conditionMultiplier = 1.5
                break
        }

        const estimatedPrice = basePrice * conditionMultiplier * (1 + images.length * 0.05)

        // Determine confidence level based on number of images
        let confidence: 'low' | 'medium' | 'high' = 'low'
        if (images.length > 5) {
            confidence = 'high'
        } else if (images.length > 2) {
            confidence = 'medium'
        }

        // Save the quote in the database
        await ctx.db.insert('quotes', {
            tenantId,
            vehicleType,
            condition,
            imageCount: images.length,
            estimatedPrice,
            confidence,
            createdAt: new Date().toISOString(),
        })

        return { amount: estimatedPrice, confidence }
    },
})

// convex/quotes.ts


export const dynamicQuote = mutation({
    args: {
        tenantId: v.id('tenants'),
        vehicleType: v.union(v.literal('sedan'), v.literal('suv'), v.literal('truck'), v.literal('van')),
        condition: v.union(v.literal('excellent'), v.literal('good'), v.literal('fair'), v.literal('poor')),
        images: v.array(v.string().url()),
    },
    handler: async (ctx, args) => {
        // TODO: create and impairment a robust and powerful dynamic pricing algorithm
        // For this example, we'll use a simple calculation

        let basePrice = 0;
        switch (args.vehicleType) {
            case 'sedan': basePrice = 100; break;
            case 'suv': basePrice = 150; break;
            case 'truck': basePrice = 200; break;
            case 'van': basePrice = 180; break;
        }

        let conditionMultiplier = 1;
        switch (args.condition) {
            case 'excellent': conditionMultiplier = 0.8; break;
            case 'good': conditionMultiplier = 1; break;
            case 'fair': conditionMultiplier = 1.2; break;
            case 'poor': conditionMultiplier = 1.5; break;
        }

        const estimatedPrice = basePrice * conditionMultiplier;

        // Save the quote in the database
        const quoteId = await ctx.db.insert("quotes", {
            tenantId: args.tenantId,
            vehicleType: args.vehicleType,
            condition: args.condition,
            images: args.images,
            estimatedPrice,
            createdAt: new Date().toISOString(),
        });

        return {
            amount: estimatedPrice,
            confidence: 'medium' as const, // In a real scenario, this would be determined by the AI model
            quoteId,
        };
    },
});