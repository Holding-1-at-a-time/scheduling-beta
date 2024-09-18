import { v } from 'convex/values'
import { action, mutation } from './_generated/server'
import { Id } from './_generated/dataModel'
import { getUser } from './users';
import { getTenantId } from './tenants';

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
    handler: async (ctx): Promise<Id<'assessments'>> => {
        const { assessment } = ctx.args as { assessment: AssessmentInput };

        // Validate tenant and user
        const tenantId = await getTenantId(ctx);
        if (tenantId !== assessment.tenantId) {
            throw new Error("Unauthorized: Invalid tenant");
        }

        const userId = await getUserId(ctx);
        if (userId !== assessment.userId) {
            throw new Error("Unauthorized: Invalid user");
        }

        // Insert the new assessment
        const newAssessment = await ctx.db.insert("assessments", {
            tenantId,
            userId,
            assessmentData: assessment.assessmentData,
        });

        return newAssessment;
    },
});