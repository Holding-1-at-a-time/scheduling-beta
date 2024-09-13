// app/dashboard/page.tsx
import { Suspense } from 'react'
import { getBusinessMetrics } from '@/lib/analytics'
import AnalyticsOverview from '@/components/analytics-overview'
import RevenueChart from '@/components/revenue-chart'
import ServiceBreakdown from '@/components/service-breakdown'
import Loading from '@/components/loading'

export default async function AnalyticsDashboard() {
    const metrics = await getBusinessMetrics()

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
            <Suspense fallback={<Loading />}>
                <AnalyticsOverview metrics={metrics} />
            </Suspense>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Suspense fallback={<Loading />}>
                    <RevenueChart />
                </Suspense>
                <Suspense fallback={<Loading />}>
                    <ServiceBreakdown />
                </Suspense>
            </div>
        </div>
    )
}