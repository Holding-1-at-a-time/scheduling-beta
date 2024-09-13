// components/availability-calendar.tsx
'use client'

import React from 'react';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Calendar } from '@/components/ui/calendar';
import { Spinner } from '@/components/ui/spinner';

interface AvailabilityCalendarProps {
    onDateRangeSelect: (range: { from: Date; to: Date }) => void;
}

export const AvailabilityCalendar: React.FC<AvailabilityCalendarProps> = ({ onDateRangeSelect }) => {
    const availableSlots = useQuery(api.availability.getAvailableSlots);

    if (!availableSlots) {
        return <Spinner />;
    }

    return (
        <Calendar
            mode="range"
            selected={{}}
            onSelect={(range) => {
                if (range?.from && range?.to) {
                    onDateRangeSelect(range);
                }
            }}
            disabled={(date) => !availableSlots.some(slot =>
                slot.date.toDateString() === date.toDateString()
            )}
            className="rounded-md border"
        />
    );
};