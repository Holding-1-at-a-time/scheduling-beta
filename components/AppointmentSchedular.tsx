import React, { useState, useMemo, useCallback } from "react";
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { format, parseISO, isValid, startOfDay, endOfDay } from 'date-fns';
import { toast } from '@/components/ui/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AppointmentForm } from "@/components/appointment-form";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

interface Appointment {
    _id: string;
    date: string;
    customerId: string;
    serviceId: string;
    status: string;
}

export function AppointmentScheduler() {
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [isCreatingAppointment, setIsCreatingAppointment] = useState(false);
    const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");

    const appointments = useQuery(api.appointments.listByTenant);
    const createAppointment = useMutation(api.appointments.create);
    const updateAppointment = useMutation(api.appointments.update);
    const cancelAppointment = useMutation(api.appointments.cancel);

    const filteredAppointments = useMemo(() => {
        if (!appointments) {
            return {}
        };
        return appointments.filter((appointment) => {
            const appointmentDate = parseISO(appointment.date);
            const isOnSelectedDate = isValid(appointmentDate) &&
                appointmentDate >= startOfDay(selectedDate) &&
                appointmentDate < endOfDay(selectedDate);
            const matchesSearch = searchTerm === "" ||
                appointment.customerId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                appointment.serviceId.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus = statusFilter === "all" || appointment.status === statusFilter;
            return isOnSelectedDate && matchesSearch && matchesStatus;
        });
    }, [appointments, selectedDate, searchTerm, statusFilter]);

    const handleDateChange = useCallback((date: Date | undefined) => {
        if (date) setSelectedDate(date);
    }, []);

    const handleAppointmentCreate = useCallback(async (appointmentData: Partial<Appointment>) => {
        try {
            await createAppointment({
                date: new Date(appointmentData.date!).getTime(),
                customerId: appointmentData.customerId!,
                serviceId: appointmentData.serviceId!,
            });
            toast({ title: "Success", description: "Appointment created successfully" });
            setIsCreatingAppointment(false);
        } catch (error) {
            console.error("Error creating appointment:", error);
            toast({ title: "Error", description: "Failed to create appointment", variant: "destructive" });
        }
    }, [createAppointment]);

    const handleAppointmentUpdate = useCallback(async (appointmentId: string, appointmentData: Partial<Appointment>) => {
        try {
            await updateAppointment({
                id: appointmentId,
                date: new Date(appointmentData.date!).getTime(),
                status: appointmentData.status,
            });
            toast({ title: "Success", description: "Appointment updated successfully" });
            setEditingAppointment(null);
        } catch (error) {
            console.error("Error updating appointment:", error);
            toast({ title: "Error", description: "Failed to update appointment", variant: "destructive" });
        }
    }, [updateAppointment]);

    const handleAppointmentCancel = useCallback(async (appointmentId: string) => {
        try {
            await cancelAppointment({ id: appointmentId });
            toast({ title: "Success", description: "Appointment cancelled successfully" });
        } catch (error) {
            console.error("Error cancelling appointment:", error);
            toast({ title: "Error", description: "Failed to cancel appointment", variant: "destructive" });
        }
    }, [cancelAppointment]);

    if (appointments === undefined) {
        return <Spinner />;
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Appointments</h1>
                <Button onClick={() => setIsCreatingAppointment(true)}>Create Appointment</Button>
            </div>
            <div className="grid grid-cols-[300px_1fr] gap-4">
                <div>
                    <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={handleDateChange}
                        className="rounded-md border"
                    />
                    <div className="mt-4">
                        <Input
                            placeholder="Search appointments..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="mb-2"
                        />
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger>
                                <SelectValue placeholder="Filter by status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Statuses</SelectItem>
                                <SelectItem value="scheduled">Scheduled</SelectItem>
                                <SelectItem value="completed">Completed</SelectItem>
                                <SelectItem value="cancelled">Cancelled</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Time</TableHead>
                            <TableHead>Customer</TableHead>
                            <TableHead>Service</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredAppointments.map((appointment) => (
                            <TableRow key={appointment._id}>
                                <TableCell>{format(parseISO(appointment.date), 'HH:mm')}</TableCell>
                                <TableCell>{appointment.customerId}</TableCell>
                                <TableCell>{appointment.serviceId}</TableCell>
                                <TableCell>
                                    <Badge
                                        variant={
                                            appointment.status === "scheduled"
                                                ? "secondary"
                                                : appointment.status === "completed"
                                                    ? "success"
                                                    : "destructive"
                                        }
                                    >
                                        {appointment.status}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setEditingAppointment(appointment)}
                                        >
                                            Edit
                                        </Button>
                                        {appointment.status === "scheduled" && (
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                onClick={() => handleAppointmentCancel(appointment._id)}
                                            >
                                                Cancel
                                            </Button>
                                        )}
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
            <Dialog open={isCreatingAppointment} onOpenChange={setIsCreatingAppointment}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Create New Appointment</DialogTitle>
                    </DialogHeader>
                    <AppointmentForm onSubmit={handleAppointmentCreate} onCancel={() => setIsCreatingAppointment(false)} />
                </DialogContent>
            </Dialog>
            <Dialog open={!!editingAppointment} onOpenChange={() => setEditingAppointment(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Appointment</DialogTitle>
                    </DialogHeader>
                    {editingAppointment && (
                        <AppointmentForm
                            onSubmit={(data) => handleAppointmentUpdate(editingAppointment._id, data)}
                            onCancel={() => setEditingAppointment(null)}
                            initialData={editingAppointment}
                        />
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
