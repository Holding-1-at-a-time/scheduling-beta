// components/intelligent-scheduling-system.tsx
"use client";

import React, { useState } from 'react';
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Spinner } from "@/components/ui/spinner";

interface Slot {
  id: string;
  time: string;
}

const bookingSchema = z.object({
  clientName: z.string().min(1, "Name is required"),
  clientEmail: z.string().email("Invalid email address"),
});

export function IntelligentSchedulingSystem() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const availableSlots = useQuery(api.scheduling.getAvailableSlots,
    selectedDate ? { date: selectedDate.toISOString().split('T')[0] } : 'skip'
  );
  const bookAppointment = useMutation(api.scheduling.bookAppointment);

  const form = useForm({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      clientName: "",
      clientEmail: "",
    },
  });

  const handleBooking = async (values: z.infer<typeof bookingSchema>) => {
    if (!selectedDate || !selectedSlot) return;

    try {
      await bookAppointment({
        date: selectedDate.toISOString().split('T')[0],
        slotId: selectedSlot.id,
        clientName: values.clientName,
        clientEmail: values.clientEmail,
      });
      toast({ title: "Appointment booked successfully" });
      setIsDialogOpen(false);
      form.reset();
    } catch (error) {
      console.error('Error booking appointment:', error);
      toast({ title: "Failed to book appointment", variant: "destructive" });
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
        {availableSlots === undefined ? (
          <Spinner />
        ) : availableSlots === null ? (
          <p>No available slots</p>
        ) : (
          availableSlots.map((slot) => (
            <Button
              key={slot.id}
              onClick={() => {
                setSelectedSlot(slot);
                setIsDialogOpen(true);
              }}
            >
              {slot.time}
            </Button>
          ))
        )}
      </div>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Book Appointment</DialogTitle>
            <DialogDescription>
              {selectedDate && selectedSlot && (
                `Booking for ${selectedDate.toDateString()} at ${selectedSlot.time}`
              )}
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleBooking)} className="space-y-4">
              <FormField
                control={form.control}
                name="clientName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="clientEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input {...field} type="email" />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button type="submit">Book Appointment</Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}