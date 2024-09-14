// app/dashboard/page.tsx
import Loading from '@/app/loading'
import AnalyticsOverview from '@/components/Analytics-Overview'
import RevenueChart from '@/components/Revenue-Chart'
import ServiceBreakdown from '@/components/Service-Breakdown'
import { getBusinessMetrics, getMetrics } from '@/convex/analytics'
import { Suspense } from 'react'


export default async function AnalyticsDashboard() {
    export const getBusinessMetrics = async (arg1: string, arg2: number) => {

        return (
            <div className="space-y-8">
                <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
                <Suspense fallback={<Loading />}>
                    <AnalyticsOverview metrics={getMetrics} />
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