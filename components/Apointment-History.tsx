// components/appointment-history.tsx
'use client'

import { useState } from 'react'
import { useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Spinner } from "@/components/ui/spinner"

export function AppointmentHistory() {
    const [page, setPage] = useState(1)
    const pageSize = 10
    const appointments = useQuery(api.appointments.list, { page, pageSize })

    const handleNextPage = () => {
        setPage(prevPage => prevPage + 1)
    }

    const handlePreviousPage = () => {
        setPage(prevPage => Math.max(prevPage - 1, 1))
    }

    if (appointments === undefined) {
        return <Spinner />
    }

    if (appointments === null) {
        return <div>Error loading appointments. Please try again.</div>
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Appointment History</CardTitle>
            </CardHeader>
            <CardContent>
                <ul className="space-y-4">
                    {appointments.map(appointment => (
                        <li key={appointment._id} className="border-b pb-2">
                            <div className="font-semibold">{new Date(appointment.date).toLocaleString()}</div>
                            <div>{appointment.details}</div>
                        </li>
                    ))}
                </ul>
                <div className="flex justify-between mt-4">
                    <Button onClick={handlePreviousPage} disabled={page === 1}>Previous</Button>
                    <Button onClick={handleNextPage} disabled={appointments.length < pageSize}>Next</Button>
                </div>
            </CardContent>
        </Card>
    )
}