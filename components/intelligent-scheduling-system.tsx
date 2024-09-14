// components/intelligent-scheduling-system.tsx
"use client";

import React, { useState } from 'react';
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

interface Slot {
  id: string;
  time: string;
}

export function IntelligentSchedulingSystem() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const availableSlots = useQuery(api.scheduling.getAvailableSlots, selectedDate ? { date: selectedDate } : 'skip');
  const bookAppointment = useMutation(api.scheduling.bookAppointment);

  const handleBooking = async (slot: Slot) => {
    if (selectedDate) {
      await bookAppointment({ date: selectedDate, slotId: slot.id });
      // Handle confirmation, perhaps send an email or SMS
    }
  };

  return (
    <div className="space-y-4">
      <Calendar
        mode="single"
        selected={selectedDate}
        onSelect={setSelectedDate}
        className="rounded-md border"
      />
      <div className="grid grid-cols-3 gap-2">
        {availableSlots?.map((slot) => (
          <Button key={slot.id} onClick={() => handleBooking(slot)}>
            {slot.time}
          </Button>
        ))}
      </div>
    </div>
  );
}