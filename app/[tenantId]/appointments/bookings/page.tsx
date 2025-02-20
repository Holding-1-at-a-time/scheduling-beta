// app/appointments/page.tsx
import { AppointmentCalendar } from '@/components/Appointment-Calendar'

interface AppointmentCalendarProps {
    availableSlots: any;
}
import { getAvailableSlots } from '@/lib/appointments'
import React from 'react'

const AppointmentBookingPage = async () => {
    const availableSlots = await getAvailableSlots()

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">Book an Appointment</h1>
            <AppointmentCalendar availableSlots={availableSlots} />
        </div>
    )
}
