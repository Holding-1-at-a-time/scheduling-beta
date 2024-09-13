// components/business-insights.tsx
'use client'

import React from 'react';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Line, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

interface ServicePopularity {
    serviceName: string;
    count: number;
}

interface RevenueData {
    date: string;
    revenue: number;
}

interface CustomerRetention {
    date: string;
    retentionRate: number;
}

export function BusinessInsights() {
    const servicePopularity = useQuery(api.insights.getServicePopularity);
    const revenueData = useQuery(api.insights.getRevenueData);
    const customerRetention = useQuery(api.insights.getCustomerRetention);

    if (servicePopularity === undefined || revenueData === undefined || customerRetention === undefined) {
        return <div>Loading business insights...</div>;
    }

    if (servicePopularity === null || revenueData === null || customerRetention === null) {
        return <div>Error loading business insights. Please try again.</div>;
    }

    const servicePopularityData = {
        labels: servicePopularity.map((item: ServicePopularity) => item.serviceName),
        datasets: [
            {
                label: 'Popularity',
                data: servicePopularity.map((item: ServicePopularity) => item.count),
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgb(75, 192, 192)',
                borderWidth: 1,
            },
        ],
    };

    const revenueChartData = {
        labels: revenueData.map((item: RevenueData) => item.date),
        datasets: [
            {
                label: 'Revenue',
                data: revenueData.map((item: RevenueData) => item.revenue),
                fill: false,
                backgroundColor: 'rgb(54, 162, 235)',
                borderColor: 'rgba(54, 162, 235, 0.2)',
            },
        ],
    };

    const customerRetentionData = {
        labels: customerRetention.map((item: CustomerRetention) => item.date),
        datasets: [
            {
                label: 'Retention Rate',
                data: customerRetention.map((item: CustomerRetention) => item.retentionRate),
                backgroundColor: 'rgba(255, 159, 64, 0.2)',
                borderColor: 'rgb(255, 159, 64)',
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
                    <CardTitle>Service Popularity</CardTitle>
                </CardHeader>
                <CardContent>
                    <Bar options={options} data={servicePopularityData} />
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Revenue Over Time</CardTitle>
                </CardHeader>
                <CardContent>
                    <Line options={options} data={revenueChartData} />
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Customer Retention</CardTitle>
                </CardHeader>
                <CardContent>
                    <Bar options={options} data={customerRetentionData} />
                </CardContent>
            </Card>
        </div>
    );
}