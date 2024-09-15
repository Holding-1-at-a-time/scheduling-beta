// components/appointment-list.tsx
import React, { useState } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Spinner } from '@/components/SpinnerComponent';

interface Appointment {
    id: string;
    date: number;
    customerId: string;
    status: 'scheduled' | 'completed' | 'no-show';
    isPaid: boolean;
}

export const AppointmentList() {
    const [page, setPage] = useState(1);
    const pageSize = 10;
    const { toast } = useToast();

    const appointmentsQuery = useQuery(api.appointments.list, { page, pageSize });
    const updateAppointmentStatus = useMutation(api.appointments.updateStatus);

    const handleStatusUpdate = async (id: string, newStatus: 'completed' | 'no-show') => {
        try {
            await updateAppointmentStatus({ id, status: newStatus });
            toast({
                title: "Status Updated",
                description: `Appointment status has been updated to ${newStatus}`,
            });
        } catch (error) {
            console.error('Error updating appointment status:', error);
            toast({
                title: "Update Failed",
                description: "There was an error updating the appointment status. Please try again.",
                variant: "destructive",
            });
        }
    };

    if (appointmentsQuery === undefined) {
        return <Spinner />;
    }

    const { appointments, hasMore } = appointmentsQuery;

    return (
        <div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Payment</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {appointments.map((appointment: Appointment) => (
                        <TableRow key={appointment.id}>
                            <TableCell>{new Date(appointment.date).toLocaleString()}</TableCell>
                            <TableCell>{appointment.customerId}</TableCell>
                            <TableCell>{appointment.status}</TableCell>
                            <TableCell>{appointment.isPaid ? 'Paid' : 'Unpaid'}</TableCell>
                            <TableCell>
                                {appointment.status === 'scheduled' && (
                                    <>
                                        <Button
                                            onClick={() => handleStatusUpdate(appointment.id, 'completed')}
                                            className="mr-2"
                                        >
                                            Mark Completed
                                        </Button>
                                        <Button
                                            onClick={() => handleStatusUpdate(appointment.id, 'no-show')}
                                            variant="destructive"
                                        >
                                            Mark No-Show
                                        </Button>
                                    </>
                                )}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <div className="mt-4 flex justify-between">
                <Button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>
                    Previous
                </Button>
                <Button onClick={() => setPage(p => p + 1)} disabled={!hasMore}>
                    Next
                </Button>
            </div>
        </div>
    );
}