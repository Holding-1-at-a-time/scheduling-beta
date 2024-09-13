// components/dashboard-sidebar.tsx
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
    BarChart,
    Settings,
    Calendar,
    Users,
    DollarSign
} from 'lucide-react'

const navItems = [
    { href: '/dashboard', label: 'Analytics', icon: BarChart },
    { href: '/dashboard/appointments', label: 'Appointments', icon: Calendar },
    { href: '/dashboard/customers', label: 'Customers', icon: Users },
    { href: '/dashboard/services', label: 'Services', icon: DollarSign },
    { href: '/dashboard/settings', label: 'Settings', icon: Settings },
]

export default function DashboardSidebar() {
    const pathname = usePathname()

    return (
        <aside className="w-64 bg-white shadow-md">
            <nav className="mt-8">
                <ul>
                    {navItems.map((item) => (
                        <li key={item.href}>
                            <Link
                                href={item.href}
                                className={cn(
                                    "flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100",
                                    pathname === item.href && "bg-gray-100 font-semibold"
                                )}
                            >
                                <item.icon className="w-5 h-5 mr-3" />
                                {item.label}
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>
        </aside>
    )
}