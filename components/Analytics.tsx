// components/analytics.tsx
'use client'

import React from 'react';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Line } from 'react-chartjs-2';
import { Title } from '@radix-ui/react-toast';
import { BusinessInsights } from './Business-Insights';
import { PerformanceMetrics } from './Performance-Matrics';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface AnalyticsData {
    date: string;
    revenue: number;
}

export function Analytics() {
    const analyticsData = useQuery(api.analytics.getAnalyticsData);

    if (analyticsData === undefined) {
        return <div>Loading analytics data...</div>;
    }

    if (analyticsData === null) {
        return <div>Error loading analytics data. Please try again.</div>;
    }

    const data = {
        labels: analyticsData.map((item: AnalyticsData) => item.date),
        datasets: [
            {
                label: 'Revenue',
                data: analyticsData.map((item: AnalyticsData) => item.revenue),
                fill: false,
                backgroundColor: 'rgb(75, 192, 192)',
                borderColor: 'rgba(75, 192, 192, 0.2)',
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
            },
            title: {
                display: true,
                text: 'Revenue Over Time',
            },
        },
    };

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Analytics Overview</CardTitle>
                </CardHeader>
                <CardContent>
                    <Line options={options} data={data} />
                </CardContent>
            </Card>
            <BusinessInsights />
            <PerformanceMetrics />
            <ClientReports />
        </div>
    );
}