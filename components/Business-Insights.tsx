// components/business-insights.tsx
'use client'

import React from 'react'
import { useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Line, Bar } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend } from 'chart.js'
import { useAuth } from '@clerk/nextjs'
import { Spinner } from '@/components/ui/spinner'
import { toast } from '@/components/ui/use-toast'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend)

interface ServicePopularity {
    serviceName: string
    count: number
}

interface RevenueData {
    date: string
    revenue: number
}

interface CustomerRetention {
    date: string
    retentionRate: number
}

export function BusinessInsights() {
    const { userId } = useAuth()
    const servicePopularity = useQuery(api.insights.getServicePopularity, { tenantId: userId ?? '' })
    const revenueData = useQuery(api.insights.getRevenueData, { tenantId: userId ?? '' })
    const customerRetention = useQuery(api.insights.getCustomerRetention, { tenantId: userId ?? '' })

    if (!userId) {
        return <div>Please log in to view business insights.</div>
    }

    if (servicePopularity === undefined || revenueData === undefined || customerRetention === undefined) {
        return <Spinner />
    }

    if (servicePopularity === null || revenueData === null || customerRetention === null) {
        toast({
            title: 'Error',
            description: 'Failed to load business insights. Please try again.',
            variant: 'destructive',
        })
        return null
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
    }

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
    }

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
    }

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
            },
        },
    }

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
    )
}