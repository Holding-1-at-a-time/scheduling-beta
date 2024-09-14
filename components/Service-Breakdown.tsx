// components/service-breakdown.tsx
'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'
import { useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { Spinner } from '@/components/ui/spinner'

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']

interface ServiceData {
    name: string;
    value: number;
}

export default function ServiceBreakdown() {
    const serviceData = useQuery(api.analytics.getServiceBreakdown)

    if (!serviceData) {
        return <Spinner className="m-4" />
    }

    const total = serviceData.reduce((sum, service) => sum + service.value, 0)

    return (
        <Card>
            <CardHeader>
                <CardTitle>Service Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                        <Pie
                            data={serviceData}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                            fill="#8884d8"
                            label={({ name, value }) => `${name}: ${((value / total) * 100).toFixed(2)}%`}
                        >
                            {serviceData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip
                            formatter={(value: number) => [`${value} bookings`, `${((value / total) * 100).toFixed(2)}%`]}
                        />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    )
}