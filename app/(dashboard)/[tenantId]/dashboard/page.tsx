
import AnalyticsOverview from '@/components/Analytics-Overview'
import AdminDashboard from '@/components/Admin-Dashboard'
import DashboardCard from '@/components/Dashboard-Card'
import { Header } from '@/components/Header'
import LoadingSpinner from '@/components/LoadingSpinner'
import RevenueChart from '@/components/Revenue-Chart'
import { Sidebar } from 'lucide-react'

import { Suspense } from 'react'

export default function DashboardPage() {
    return (
        <div className="flex h-screen bg-gray-100">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header />
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200">
                    <div className="container mx-auto px-6 py-8">
                        <h3 className="text-gray-700 text-3xl font-medium">Dashboard</h3>
                        <div className="mt-4">
                            <div className="flex flex-wrap -mx-6">
                                <DashboardCard title="Total Appointments" value="120" />
                                <DashboardCard title="Revenue" value="$15,000" />
                                <DashboardCard title="Pending Quotes" value="25" />
                            </div>
                        </div>
                        <div className="mt-8">
                            <Suspense fallback={<LoadingSpinner />}>
                                <AdminDashboard />
                            </Suspense>
                        </div>
                        <div className="mt-8">
                            <Suspense fallback={<LoadingSpinner />}>
                                <AnalyticsOverview />
                            </Suspense>
                        </div>
                        <div className="mt-8">
                            <Suspense fallback={<LoadingSpinner />}>
                                <Appointments-List />
                            </Suspense>
                        </div>
                        <div className="mt-8">
                            <Suspense fallback={<LoadingSpinner />}>
                                <RevenueChart />
                            </Suspense>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    )
}