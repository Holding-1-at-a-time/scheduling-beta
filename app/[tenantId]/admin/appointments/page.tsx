// app/admin/appointments/page.tsx
import { getAppointments } from '@/lib/appointments'
import AppointmentList from '@/components/appointment-list'

export default async function AppointmentManagementPage() {
    const appointments = await getAppointments()

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">Manage Appointments</h1>
            <AppointmentList appointments={appointments} />
        </div>
    )
}