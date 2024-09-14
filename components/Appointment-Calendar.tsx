// components/appointment-calendar.tsx
import React, { useState, useCallback } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Spinner } from '@/components/ui/spinner';

interface AppointmentCalendarProps {
    customerId: string;
    serviceId: string;
}

export function AppointmentCalendar({ customerId, serviceId }: AppointmentCalendarProps) {
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
    const [isBooking, setIsBooking] = useState(false);
    const { toast } = useToast();

    const startDate = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + 1);

    const availableSlots = useQuery(api.appointments.getAvailableSlots, {
        startDate: startDate.getTime(),
        endDate: endDate.getTime(),
    });

    const bookAppointment = useMutation(api.appointments.bookAppointment);

    const handleDateSelect = useCallback((date: Date | undefined) => {
        setSelectedDate(date);
    }, []);

    const handleBookAppointment = useCallback(async () => {
        if (!selectedDate) return;

        setIsBooking(true);
        try {
            await bookAppointment({
                date: selectedDate.getTime(),
                customerId,
                serviceId,
            });
            toast({
                title: "Appointment Booked",
                description: `Your appointment has been scheduled for ${selectedDate.toLocaleString()}`,
            });
        } catch (error) {
            console.error('Error booking appointment:', error);
            toast({
                title: "Booking Failed",
                description: error instanceof Error ? error.message : "There was an error booking your appointment. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsBooking(false);
        }
    }, [selectedDate, customerId, serviceId, bookAppointment, toast]);

    if (availableSlots === undefined) {
        return <Spinner />;
    }

    return (
        <div className="space-y-4">
            <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={handleDateSelect}
                disabled={(date) => !availableSlots.some(slot => slot.getTime() === date.getTime())}
                className="rounded-md border"
            />
            <Button
                onClick={handleBookAppointment}
                disabled={!selectedDate || isBooking}
                className="w-full"
            >
                {isBooking ? 'Booking...' : 'Book Appointment'}
            </Button>
        </div>
    );
}