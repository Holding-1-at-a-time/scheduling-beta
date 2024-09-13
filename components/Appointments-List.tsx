// components/appointment-list.tsx
'use client'

import { useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { updateAppointmentStatus } from '@/lib/appointments'
import { useToast } from '@/components/ui/use-toast'

interface Appointment {
    id: string
    date: Date
    clientName: string
    status: 'scheduled' | 'completed' | 'no-show'
    isPaid: boolean
}

interface AppointmentListProps {
    appointments: Appointment[]
}

export default function AppointmentList({ appointments }: AppointmentListProps) {
    const [updatingId, setUpdatingId] = useState<string | null>(null)
    const { toast } = useToast()

    const handleStatusUpdate = async (id: string, newStatus: 'completed' | 'no-show') => {
        setUpdatingId(id)
        try {
            await updateAppointmentStatus(id, newStatus)
            toast({
                title: "Status Updated",
                description: `Appointment status has been updated to ${newStatus}`,
            })
        } catch (error) {
            console.error('Error updating appointment status:', error)
            toast({
                title: "Update Failed",
                description: "There was an error updating the appointment status. Please try again.",
                variant: "destructive",
            })
        } finally {
            setUpdatingId(null)
        }
    }

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Payment</TableHead>
                    <TableHead>Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {appointments.map((appointment) => (
                    <TableRow key={appointment.id}>
                        <TableCell>{appointment.date.toLocaleString()}</TableCell>
                        <TableCell>{appointment.clientName}</TableCell>
                        <TableCell>{appointment.status}</TableCell>
                        <TableCell>{appointment.isPaid ? 'Paid' : 'Unpaid'}</TableCell>
                        <TableCell>
                            {appointment.status === 'scheduled' && (
                                <>
                                    <Button
                                        onClick={() => handleStatusUpdate(appointment.id, 'completed')}
                                        disabled={updatingId === appointment.id}
                                        className="mr-2"
                                    >
                                        Mark Completed
                                    </Button>
                                    <Button
                                        onClick={() => handleStatusUpdate(appointment.id, 'no-show')}
                                        disabled={updatingId === appointment.id}
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
    )
}