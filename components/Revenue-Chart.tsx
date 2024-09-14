// components/revenue-chart.tsx
'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { Spinner } from '@/components/ui/spinner'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { addDays, format, subDays } from 'date-fns'

type DateRange = '7d' | '30d' | '90d' | '1y'

export default function RevenueChart() {
    const [dateRange, setDateRange] = useState<DateRange>('30d')
    const endDate = new Date()
    const startDate = getStartDate(endDate, dateRange)

    const revenueData = useQuery(api.analytics.getRevenueData, {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
    })

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(value)
    }

    if (!revenueData) {
        return <Spinner className="m-4" />
    }

    return (
        <Card className="col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Revenue Over Time</CardTitle>
                <Select value={dateRange} onValueChange={(value: DateRange) => setDateRange(value)}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select date range" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="7d">Last 7 days</SelectItem>
                        <SelectItem value="30d">Last 30 days</SelectItem>
                        <SelectItem value="90d">Last 90 days</SelectItem>
                        <SelectItem value="1y">Last year</SelectItem>
                    </SelectContent>
                </Select>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={revenueData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                            dataKey="date"
                            tickFormatter={(value) => format(new Date(value), 'MMM dd')}
                        />
                        <YAxis
                            tickFormatter={(value) => formatCurrency(value)}
                        />
                        <Tooltip
                            formatter={(value: number) => formatCurrency(value)}
                            labelFormatter={(label) => format(new Date(label), 'MMM dd, yyyy')}
                        />
                        <Line type="monotone" dataKey="revenue" stroke="#8884d8" strokeWidth={2} />
                    </LineChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    )
}

function getStartDate(endDate: Date, range: DateRange): Date {
    switch (range) {
        case '7d':
            return subDays(endDate, 7)
        case '30d':
            return subDays(endDate, 30)
        case '90d':
            return subDays(endDate, 90)
        case '1y':
            return subDays(endDate, 365)
    }
}