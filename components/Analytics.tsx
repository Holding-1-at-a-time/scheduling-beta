// components/analytics.tsx
import React from 'react';
import { useQuery as useConvexQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { BusinessInsights } from './Business-Insights';
import { PerformanceMetrics } from './Performance-Matrics';
import AnalyticsOverview from './Analytics-Overview';


ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);
export function Analytics() {
    const analyticsData = useConvexQuery(api.analytics.getAnalyticsData, { tenantId: "skip" }) ?? [];
    const detailedAnalytics = useConvexQuery(api.analytics.getBusinessMetrics, { tenantId: "skip" }) ?? {
        totalRevenue: 0,
        completedServices: 0,
        noShowRate: 0,
        averageRating: 0,
        dailyData: []
    };

    if (!analyticsData || analyticsData.length === 0 || !detailedAnalytics || !detailedAnalytics.dailyData || detailedAnalytics.dailyData.length === 0) {
        return <div>Loading analytics data...</div>;
    }
    const data = {
        labels: Array.isArray(analyticsData) ? analyticsData.map((item) => item.date) : [],
        datasets: [
            {
                label: 'Revenue',
                data: Array.isArray(analyticsData) ? analyticsData.map((item) => 'revenue' in item ? item.revenue : 0) : [],
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
            <AnalyticsOverview metrics={{
                totalRevenue: detailedAnalytics.totalRevenue,
                completedServices: detailedAnalytics.completedServices,
                noShowRate: detailedAnalytics.noShowRate,
                averageRating: detailedAnalytics.averageRating
            }} />
            <Card>
                <CardHeader>
                    <CardTitle>Revenue Trend</CardTitle>
                </CardHeader>
                <CardContent>
                    <Line options={options} data={data} />
                </CardContent>
            </Card>
            <BusinessInsights data={detailedAnalytics.dailyData} />
            <PerformanceMetrics data={detailedAnalytics.dailyData} />
        </div>
    );
}