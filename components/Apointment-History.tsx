// components/appointment-history.tsx
import React, { useState } from 'react';
import { useQuery, usePaginatedQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import LoadingSpinner from './LoadingSpinner';

interface Appointment {
    _id: string;
    date: number;
    status: string;
    details: string;
}

interface AppointmentHistoryProps {
    pageSize?: number;
}

const AppointmentHistory = ({ pageSize = 10 }: AppointmentHistoryProps) => {
    const [page, setPage] = useState<number>(0);



); const { results: appointments, status, loadMore } = usePaginatedQuery(
        api.appointments.list,
        { page, pageSize },
        {}
    );

const handleNextPage = () => {
    loadMore(pageSize),
        setPage(prevPage => prevPage + 1);
};

const handlePreviousPage = () => {
    setPage(prevPage => Math.max(prevPage - 1, 0));
};


if (status === "LoadingFirstPage" || status === "LoadingMore") {
    return <LoadingSpinner />;
}


return (
    <Card>
        <CardHeader>
            <CardTitle>Appointment History</CardTitle>
        </CardHeader>
        <CardContent>
            {appointments.length === 0 ? (
                <p>No appointments found.</p>
            ) : (
                <ul className="space-y-4">
                    {appointments.map((appointment: Appointment) => (
                        <li key={appointment._id} className="border-b pb-2">
                            <div className="font-semibold">{new Date(appointment.date).toLocaleString()}</div>
                            <div>Status: {appointment.status}</div>
                            <div>{appointment.details}</div>
                        </li>
                    ))}
                </ul>
            )}
            <div className="flex justify-between mt-4">
                <Button onClick={handlePreviousPage} disabled={page === 0}>Previous</Button>
                <Button onClick={handleNextPage} disabled={status !== "CanLoadMore"}>Next</Button>
            </div>
        </CardContent>
    </Card>
);
};
