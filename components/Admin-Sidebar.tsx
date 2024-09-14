// components/admin-sidebar.tsx
"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from "@/lib/utils";
import { HomeIcon, UsersIcon, SettingsIcon, ToolIcon, BarChartIcon, MessageSquareIcon } from 'lucide-react';

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: HomeIcon },
  { href: '/admin/users', label: 'Users', icon: UsersIcon },
  { href: '/admin/settings', label: 'Settings', icon: SettingsIcon },
  { href: '/admin/services', label: 'Services', icon: ToolIcon },
  { href: '/admin/reports', label: 'Reports', icon: BarChartIcon },
  { href: '/admin/messages', label: 'Messages', icon: MessageSquareIcon },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <div className="bg-white w-64 h-screen flex flex-col">
      <div className="flex items-center justify-center h-20 shadow-md">
        <h1 className="text-3xl uppercase text-indigo-500">Slick Solutions</h1>
      </div>
      <ul className="flex flex-col py-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <li key={item.href}>
              <Link href={item.href} className={cn(
                "flex flex-row items-center h-12 transform hover:translate-x-2 transition-transform ease-in duration-200 text-gray-500 hover:text-gray-800",
                pathname === item.href && "text-emerald-500 font-bold"
              )}>
                <span className="inline-flex items-center justify-center h-12 w-12 text-lg text-gray-400">
                  <Icon className="h-5 w-5" />
                </span>
                <span className="text-sm font-medium">{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}