// app/dashboard/settings/page.tsx
import { Suspense } from 'react'
import ProfileForm from '@/components/profile-form'
import ServiceForm from '@/components/service-form'
import Loading from '@/components/loading'

export default function SettingsPage() {
    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold">Settings</h1>
            <Suspense fallback={<Loading />}>
                <ProfileForm />
            </Suspense>
            <Suspense fallback={<Loading />}>
                <ServiceForm />
            </Suspense>
        </div>
    )
}