import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";
import { getUser } from './users'

export const addConditionDetail = mutation({
    args: {
        tenantId: v.id('tenants'),
        hotspotId: v.id('vehicleParts'),
        issueType: v.string(),
        severity: v.string(),
    },
    handler: async (ctx, args) => {
        const { tenantId, hotspotId, issueType, severity } = args
        return await ctx.db.insert('conditionDetails', {
            tenantId,
            hotspotId,
            issueType,
            severity,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            conditionDetailId: ctx.db.newId('conditionDetails'),
            assessmentId: ctx.db.newId('assessments'),
            deleted: false,
        });
    },
})

interface Question {
    question: string;
    answer: string;
}

interface AssessmentData {
    questions: Question[];
}

interface AssessmentInput {
    tenantId: string;
    userId: string;
    assessmentData: AssessmentData;
}

/**
 * Adds a new assessment to the database.
 * 
 * @param {object} args - The assessment data.
 * @returns {Promise<object>} The newly added assessment.
 */
export const addAssessment = action({
    args: {
        assessment: v.object({
            tenantId: v.string(),
            userId: v.string(),
            assessmentData: v.object({
                questions: v.array(
                    v.object({
                        question: v.string(),
                        answer: v.string(),
                    })
                ),
            }),
        }),
    },
    handler: async (ctx, args): Promise<Id<'assessments'>> => {
        const { assessment } = args;

        // Validate tenant and user
        const tenantId = await getTenantId(ctx);
        if (tenantId !== assessment.tenantId) {
            throw new Error("Unauthorized: Invalid tenant");
        }

        const user = await getUser(ctx);
        if (!user || user._id !== assessment.userId) {
            throw new Error("Unauthorized: Invalid user");
        }

        // Insert the new assessment
        const newAssessment = await ctx.db.insert("assessments", {
            tenantId,
            userId: user._id,
            assessmentData: assessment.assessmentData,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            deleted: false,
        });

        return newAssessment;
    },
});

export const createAssessment = mutation({
    args: {
        // ... existing args ...
    },
    handler: async (ctx, args) => {
        const assessmentId = await ctx.db.insert("assessments", {
            // ... existing fields ...
        });

        const questionId = await ctx.db.insert("questions", {
            // ... existing fields ...
        });

        // ... rest of the function ...
    },
});