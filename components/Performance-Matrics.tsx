// components/performance-metrics.tsx
'use client'

import React from 'react';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

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
    const appointmentDurations = useQuery(api.metrics.getAppointmentDurations);
    const customerSatisfaction = useQuery(api.metrics.getCustomerSatisfaction);
    const staffProductivity = useQuery(api.metrics.getStaffProductivity);

    if (appointmentDurations === undefined || customerSatisfaction === undefined || staffProductivity === undefined) {
        return <div>Loading performance metrics...</div>;
    }

    if (appointmentDurations === null || customerSatisfaction === null || staffProductivity === null) {
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
                    <Bar options={options} data={customerSatisfactionData} />
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