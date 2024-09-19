// app/dashboard/layout.tsx
import { ReactNode } from 'react'
import DashboardSidebar from '@/components/dashboard-sidebar'
import { getCurrentUser } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function DashboardLayout({ children }: { children: ReactNode }) {
    const user = await getCurrentUser()

    if (!user) {
        // Redirect to login if not authenticated
        redirect('/login')
    }

    return (
        <div className="flex h-screen bg-gray-100">
            <DashboardSidebar />
            <main className="flex-1 overflow-y-auto p-8">
                {children}
            </main>
        </div>
    )
}