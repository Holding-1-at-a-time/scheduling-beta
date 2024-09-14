// components/dashboard-sidebar.tsx
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
    BarChart,
    Settings,
    Calendar,
    Users,
    DollarSign,
    Menu
} from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'

const navItems = [
    { href: '/dashboard', label: 'Analytics', icon: BarChart },
    { href: '/dashboard/appointments', label: 'Appointments', icon: Calendar },
    { href: '/dashboard/customers', label: 'Customers', icon: Users },
    { href: '/dashboard/services', label: 'Services', icon: DollarSign },
    { href: '/dashboard/settings', label: 'Settings', icon: Settings },
]

export default function DashboardSidebar() {
    const pathname = usePathname()
    const [isOpen, setIsOpen] = useState(false)

    return (
        <>
            <Button
                className="lg:hidden fixed top-4 left-4 z-50"
                onClick={() => setIsOpen(!isOpen)}
            >
                <Menu className="h-4 w-4" />
            </Button>
            <aside className={cn(
                "fixed top-0 left-0 z-40 w-64 h-screen transition-transform bg-white shadow-md",
                isOpen ? "translate-x-0" : "-translate-x-full",
                "lg:translate-x-0"
            )}>
                <nav className="h-full px-3 py-4 overflow-y-auto">
                    <ul className="space-y-2 font-medium">
                        {navItems.map((item) => (
                            <li key={item.href}>
                                <Link
                                    href={item.href}
                                    className={cn(
                                        "flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100",
                                        pathname === item.href && "bg-gray-100 font-semibold"
                                    )}
                                    onClick={() => setIsOpen(false)}
                                >
                                    <item.icon className="w-6 h-6 text-gray-500 transition duration-75" />
                                    <span className="ml-3">{item.label}</span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>
            </aside>
        </>
    )
}