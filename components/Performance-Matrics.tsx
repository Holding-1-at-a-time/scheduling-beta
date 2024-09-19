// components/performance-metrics.tsx
'use client'

<<<<<<< HEAD
import React from 'react';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);
=======
import React, { useMemo } from 'react';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bar, Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, Title, Tooltip, Legend, PointElement } from 'chart.js';
import { useUser } from '@clerk/nextjs';
import { Spinner } from '@/components/ui/spinner';
import { toast } from '@/components/ui/use-toast';

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend);
>>>>>>> development

interface AppointmentDuration {
    date: string;
    duration: number;
}

interface CustomerSatisfaction {
    date: string;
    satisfactionScore: number;
}

interface StaffProductivity {
    staffName: string;
    productivityScore: number;
}

export function PerformanceMetrics() {
<<<<<<< HEAD
    const appointmentDurations = useQuery(api.metrics.getAppointmentDurations);
    const customerSatisfaction = useQuery(api.metrics.getCustomerSatisfaction);
    const staffProductivity = useQuery(api.metrics.getStaffProductivity);

    if (appointmentDurations === undefined || customerSatisfaction === undefined || staffProductivity === undefined) {
        return <div>Loading performance metrics...</div>;
    }

    if (appointmentDurations === null || customerSatisfaction === null || staffProductivity === null) {
=======
    const { user } = useUser();
    const tenantId = user?.id;

    const appointmentDurations = useQuery(api.metrics.getAppointmentDurations, tenantId ? { tenantId } : 'skip');
    const customerSatisfaction = useQuery(api.metrics.getCustomerSatisfaction, tenantId ? { tenantId } : 'skip');
    const staffProductivity = useQuery(api.metrics.getStaffProductivity, tenantId ? { tenantId } : 'skip');

    const isLoading = appointmentDurations === undefined || customerSatisfaction === undefined || staffProductivity === undefined;
    const hasError = appointmentDurations === null || customerSatisfaction === null || staffProductivity === null;

    useMemo(() => {
        if (hasError) {
            toast({
                title: "Error loading metrics",
                description: "Please try again later or contact support if the problem persists.",
                variant: "destructive",
            });
        }
    }, [hasError]);

    if (!tenantId) {
        return <div>Please sign in to view performance metrics.</div>;
    }

    if (isLoading) {
        return <Spinner />;
    }

    if (hasError) {
>>>>>>> development
        return <div>Error loading performance metrics. Please try again.</div>;
    }

    const appointmentDurationsData = {
        labels: appointmentDurations.map((item: AppointmentDuration) => item.date),
        datasets: [
            {
                label: 'Duration (minutes)',
                data: appointmentDurations.map((item: AppointmentDuration) => item.duration),
                backgroundColor: 'rgba(153, 102, 255, 0.2)',
                borderColor: 'rgb(153, 102, 255)',
                borderWidth: 1,
            },
        ],
    };

    const customerSatisfactionData = {
        labels: customerSatisfaction.map((item: CustomerSatisfaction) => item.date),
        datasets: [
            {
                label: 'Satisfaction',
                data: customerSatisfaction.map((item: CustomerSatisfaction) => item.satisfactionScore),
                backgroundColor: 'rgba(255, 206, 86, 0.2)',
                borderColor: 'rgb(255, 206, 86)',
                borderWidth: 1,
<<<<<<< HEAD
=======
                tension: 0.1,
>>>>>>> development
            },
        ],
    };

    const staffProductivityData = {
        labels: staffProductivity.map((item: StaffProductivity) => item.staffName),
        datasets: [
            {
                label: 'Productivity',
                data: staffProductivity.map((item: StaffProductivity) => item.productivityScore),
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgb(255, 99, 132)',
                borderWidth: 1,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
            },
<<<<<<< HEAD
=======
            tooltip: {
                mode: 'index' as const,
                intersect: false,
            },
        },
        scales: {
            y: {
                beginAtZero: true,
            },
>>>>>>> development
        },
    };

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Appointment Durations</CardTitle>
                </CardHeader>
                <CardContent>
                    <Bar options={options} data={appointmentDurationsData} />
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Customer Satisfaction</CardTitle>
                </CardHeader>
                <CardContent>
<<<<<<< HEAD
                    <Bar options={options} data={customerSatisfactionData} />
=======
                    <Line options={options} data={customerSatisfactionData} />
>>>>>>> development
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Staff Productivity</CardTitle>
                </CardHeader>
                <CardContent>
                    <Bar options={options} data={staffProductivityData} />
                </CardContent>
            </Card>
        </div>
    );
}