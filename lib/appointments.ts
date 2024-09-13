// lib/appointments.ts
import { v } from 'convex/values'
import { mutation, query } from './_generated/server'
import { sendSmsReminder, sendEmailReminder } from './notifications'

export const getAvailableSlots = query({
    args: {},
    handler: async (ctx) => {
        // Fetch available slots from Convex
        const slots = await ctx.db.query('availableSlots').collect()
        return slots.map(slot => new Date(slot.date))
    }
})

export const bookAppointment = mutation({
    args: { date: v.string() },
    handler: async (ctx, args) => {
        const { date } = args
        const userId = await ctx.auth.getUserIdentity()
        if (!userId) throw new Error('Unauthorized')

        // Store appointment in Convex
        const appointmentId = await ctx.db.insert('appointments', {
            date: new Date(date),
            userId: userId.subject,
            status: 'scheduled',
            isPaid: false,
        })

        // Schedule reminders
        await scheduleReminders(appointmentId, new Date(date))

        return appointmentId
    }
})

export const getAppointments = query({
    args: {},
    handler: async (ctx) => {
        const userId = await ctx.auth.getUserIdentity()
        if (!userId) throw new Error('Unauthorized')

        // Fetch appointments for the current user (solopreneur)
        const appointments = await ctx.db
            .query('appointments')
            .filter(q => q.eq(q.field('userId'), userId.subject))
            .collect()

        return appointments.map(appointment => ({
            ...appointment,
            date: new Date(appointment.date)
        }))
    }
})

export const updateAppointmentStatus = mutation({
    args: { id: v.id('appointments'), status: v.union(v.literal('completed'), v.literal('no-show')) },
    handler: async (ctx, args) => {
        const { id, status } = args
        const userId = await ctx.auth.getUserIdentity()
        if (!userId) throw new Error('Unauthorized')

        // Update appointment status in Convex
        await ctx.db.patch(id, { status })

        // If marked as no-show, you might want to trigger additional actions here
        if (status === 'no-show') {
            // e.g., send notification to solopreneur, update analytics, etc.
        }
    }
})

async function scheduleReminders(appointmentId: string, appointmentDate: Date) {
    const reminderTimes = [
        { minutes: 24 * 60, method: 'email' },
        { minutes: 60, method: 'sms' },
    ]

    for (const reminder of reminderTimes) {
        const reminderDate = new Date(appointmentDate.getTime() - reminder.minutes * 60000)

        if (reminder.method === 'sms') {
            await sendSmsReminder(appointmentId, reminderDate)
        } else {
            await sendEmailReminder(appointmentId, reminderDate)
        }
    }
}