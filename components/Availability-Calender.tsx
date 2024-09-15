// components/availability-calendar.tsx
import React from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Calendar } from '@/components/ui/calendar';
import { Spinner } from '@/components/ui/spinner';
import { useToast } from '@/components/ui/use-toast';

interface AvailabilityCalendarProps {
    onDateRangeSelect: (range: { from: Date; to: Date }) => void;
}

export const AvailabilityCalendar: React.FC<AvailabilityCalendarProps> = ({ onDateRangeSelect }) => {
    const startDate = new Date();
    const endDate = new Date(startDate.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days from now
    const availableSlots = useQuery(api.availability.getAvailableSlots, {
        startDate: startDate.getTime(),
        endDate: endDate.getTime(),
    });
    const setAvailability = useMutation(api.availability.setAvailability);
    const { toast } = useToast();

    if (availableSlots === undefined) {
        return <Spinner />;
    }

    const handleSelect = (range: { from: Date | undefined; to: Date | undefined }) => {
        if (range.from && range.to) {
            onDateRangeSelect({ from: range.from, to: range.to });
        }
    };

    const handleDateClick = async (date: Date) => {
        try {
            const isCurrentlyAvailable = availableSlots.some(slot => new Date(slot.date).toDateString() === date.toDateString());
            await setAvailability({ date: date.getTime(), isAvailable: !isCurrentlyAvailable });
            toast({
                title: "Availability Updated",
                description: `${date.toDateString()} is now ${!isCurrentlyAvailable ? 'unavailable' : 'available'}.`,
            });
        } catch (error) {
            console.error('Error updating availability:', error);
            toast({
                title: "Update Failed",
                description: "There was an error updating the availability. Please try again.",
                variant: "destructive",
            });
        }
    };

    return (
        <Calendar
            mode="range"
            onSelect={handleSelect}
            selected={{}}
            onClickDay={handleDateClick}
            disabled={(date) =>
                date < startDate || date > endDate
            }
            modifiers={{
                available: (date) => availableSlots.some(slot => new Date(slot.date).toDateString() === date.toDateString()),
            }}
            modifiersClassNames={{
                available: "bg-green-200",
            }}
            className="rounded-md border"
        />
    );
};
