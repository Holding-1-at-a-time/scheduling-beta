import { Logger } from '@/lib/logger';
// convex/advancedSettings.ts
import { ConvexError, v } from "convex/values";
import { action, internalAction, mutation, query } from "./_generated/server";
import { getTenantId } from "./permissions";


interface AdvancedSettings {
    dataRetention: string;
    defaultTimezone: string;
    defaultLanguage: string;
}

interface ExportData {
    users: User[];
    appointments: Appointment[];
    services: Service[];
    exportDate: string;
}

interface User {
    // Add properties for the User type
    id: string;
    name: string;
    email: string;
}

interface Appointment {
    // Add properties for the Appointment type
    id: string;
    userId: string;
    date: string;
}

interface Service {
    // Add properties for the Service type
    id: string;
    name: string;
    description: string;
}

export const get = query({
    args: {},
    handler: async (ctx): Promise<AdvancedSettings | null> => {
        const tenantId = await getTenantId(ctx);
        const settings = await ctx.db
            .query("advancedSettings")
            .withIndex("by_tenantId", (q) => q.eq("tenantId", tenantId))
            .first();

        if (!settings) {
            return null;
        }

        Logger.info("Advanced settings fetched", { tenantId });
        return settings;
    },
});

export const update = mutation({
    args: {
        settings: v.object({
            dataRetention: v.string(),
            defaultTimezone: v.string(),
            defaultLanguage: v.string(),
        }),
    },
    handler: async (ctx, args: { settings: AdvancedSettings }) => {
        const tenantId = await getTenantId(ctx);
        const existingSettings = await ctx.db
            .query("advancedSettings")
            .withIndex("by_tenantId", (q) => q.eq("tenantId", tenantId))
            .first();

        try {
            if (existingSettings) {
                await ctx.db.patch(existingSettings._id, args.settings);
            } else {
                await ctx.db.insert("advancedSettings", {
                    id: ctx.db.generateId("advancedSettings"),
                    tenantId,
                    isAdmin: false,
                    notification: {
                        email: false,
                        phone: false,
                    },
                    privacyPolicy: "",
                    termsAndConditions: "",
                    notificationTypes: "",
                    dateFormat: "",
                    timeFormat: "",
                    currency: "",
                    payment: {
                        gateway: "",
                        terms: "",
                    },
                    twoFactorAuth: false,
                    passwordPolicy: "",
                    integration: {
                        css: "",
                        js: "",
                    },
                    analytics: {
                        enabled: false,
                        reportingFrequency: "",
                    },
                    compliance: {
                        requirements: "",
                    },
                    branding: {
                        theme: "",
                        logo: "",
                        favicon: "",
                    },
                });

            }
            ctx.logger.info("Advanced settings updated", { tenantId });
        } catch (error) {
            Logger.error("Error updating advanced settings", { error, tenantId });
            throw new ConvexError("Failed to update settings");
        }
    },
});


export const exportData = internalAction({
    args: {
        tenantId: v.id("tenants"),
        exportDate: v.string(), // Remove this as it's not used
        users: v.array(v.object({
            id: v.id("users"),
            name: v.string(),
            email: v.string(),
        })),
        appointments: v.array(v.object({
            id: v.id("appointments"),
            userId: v.id("users"),
            date: v.string(),
        })),
        services: v.array(v.object({
            id: v.id("services"),
            name: v.string(),
            description: v.string(),
        })),
    },
    handler: async (ctx): Promise<string> => {
        const tenantId = await getTenantId(ctx);

        try {
            const [users, appointments, services] = await Promise.all([
                (ctx as any).db.query("users").withIndex("by_tenantId", (q: any) => q.eq("tenantId", tenantId)).collect(),
                (ctx as any).db.query("appointments").withIndex("by_tenantId", (q: any) => q.eq("tenantId", tenantId)).collect(),
                (ctx as any).db.query("services").withIndex("by_tenantId", (q: any) => q.eq("tenantId", tenantId)).collect(),
            ]);

            const exportData: ExportData = {
                users,
                appointments,
                services,
                exportDate: new Date().toISOString(),
            };

            return JSON.stringify(exportData);
        } catch (error) {
            throw new ConvexError{( message: "Failed to export data")};
        };
    },
});