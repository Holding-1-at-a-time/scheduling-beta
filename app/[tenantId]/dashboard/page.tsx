import AnalyticsOverview from '@/components/Analytics-Overview'
import { AdminDashboard } from '@/components/Admin-Dashboard'
import { DashboardCard } from '@/components/Dashboard-Card'
import { Header } from '@/components/Header'
import LoadingSpinner from '@/components/LoadingSpinner'
import RevenueChart from '@/components/Revenue-Chart'
import { Sidebar } from 'lucide-react'
import React, { Suspense } from 'react'
import * as AppointmentsListModule from '@/components/Appointments-List';
import { number } from 'zod'


const AppointmentsList = React.lazy(() => AppointmentsListModule.AppointmentList);

const AppointmentsListComponent = () => (
    <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Appointments</h1>
        <AppointmentsList />
    </div>
);

const getDashboardData = async () => {
    const response = await fetch('/api/dashboard');
    const data = await response.json();
    return data;
};

const getMetrics = async () => {
    const response = await fetch('/api/metrics');
    const data = await response.json();
    console.log(data)
    if (response.ok) {
        return data;
    } else {
        throw new Error('Failed to fetch metrics');
    }
};

const getDashboardMetrics = async () => {
    const response = await fetch('/api/metrics');
    const data = await response.json();
    if (response.ok) {
        return data;
    } else {
        throw new Error('Failed to fetch metrics');
    }
};

const getDashboardMetricsDefault = async () => {
    const response = await fetch('/api/metrics');
    const data = await response.json();
    if (response.ok) {
        return data;
    } else {
        throw new Error('Failed to fetch metrics');
    }
};

interface DashboardPageProps {
    data: {
        totalUsers: number;
        totalOrganizations: number;
        activeAppointments: number;
    };
    metrics: {
        totalRevenue: number;
        completedServices: number;
        noShowRate: number;
        averageRating: number;
    };
}

interface DashboardCardProps {
    title: string;
    value: number; // Add this line
}

const DashboardPage: React.FC<DashboardPageProps> = ({ data, metrics }) => {
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
                            </div>
                            <DashboardCard
                                title="Total Users"
                                value={data.totalUsers}
                            />
                            <DashboardCard
                                title="Total Organizations"
                                value={data.totalOrganizations}
                            />
                            <DashboardCard
                                title="Active Appointments"
                                value={data.activeAppointments}
                            />
                            <DashboardCard
                                title="Total Revenue"
                                value={metrics.totalRevenue}
                            />
                            <DashboardCard
                                title="Completed Services"
                                value={metrics.completedServices}
                            />
                            <DashboardCard
                                title="No-Show Rate"
                                value={metrics.noShowRate}
                            />
                        </div>
                        <div className="mt-8">
                            <Suspense fallback={<LoadingSpinner />}>
                                <AdminDashboard data={data} />
                            </Suspense>
                        </div>
                        <div className="mt-8">
                            <Suspense fallback={<LoadingSpinner />}>
                                <AnalyticsOverview metrics={metrics} />
                            </Suspense>
                        </div>
                        <div className="mt-8">
                            <Suspense fallback={<LoadingSpinner />}>
                                <AppointmentsList />
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
    );
}

