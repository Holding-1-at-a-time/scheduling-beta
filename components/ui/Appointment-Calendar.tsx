// components/appointment-calendar.tsx
'use client'

import { useState } from 'react'
import { Calendar } from '@/components/ui/calendar'
import { Button } from '@/components/ui/button'
import { bookAppointment } from '@/lib/appointments'
import { useToast } from '@/components/ui/use-toast'

interface AppointmentCalendarProps {
    availableSlots: Date[]
}

export default function AppointmentCalendar({ availableSlots }: AppointmentCalendarProps) {
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
    const [isBooking, setIsBooking] = useState(false)
    const { toast } = useToast()

    const handleDateSelect = (date: Date | undefined) => {
        setSelectedDate(date)
    }

    const handleBookAppointment = async () => {
        if (!selectedDate) return

        setIsBooking(true)
        try {
            await bookAppointment(selectedDate)
            toast({
                title: "Appointment Booked",
                description: `Your appointment has been scheduled for ${selectedDate.toLocaleString()}`,
            })
        } catch (error) {
            console.error('Error booking appointment:', error)
            toast({
                title: "Booking Failed",
                description: "There was an error booking your appointment. Please try again.",
                variant: "destructive",
            })
        } finally {
            setIsBooking(false)
        }
    }

    return (
        <div className="space-y-4">
            <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={handleDateSelect}
                disabled={(date) =>
                    !availableSlots.some(slot =>
                        slot.toDateString() === date.toDateString()
                    )
                }
            />
            <Button
                onClick={handleBookAppointment}
                disabled={!selectedDate || isBooking}
            >
                {isBooking ? 'Booking...' : 'Book Appointment'}
            </Button>
        </div>
    )
}