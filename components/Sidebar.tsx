// components/sidebar.tsx
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BellIcon, BriefcaseIcon, CalendarIcon, CoinsIcon, HomeIcon, InfoIcon, MountainIcon, ReceiptIcon, SettingsIcon, UsersIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { OrganizationSwitcher } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';

export default function Sidebar() {
  const pathname = usePathname();
  const notifications = useQuery(api.notifications.getUnreadCount);

  const links = [
    { href: "/", icon: HomeIcon, label: "Dashboard" },
    { href: "/clients", icon: BriefcaseIcon, label: "Clients" },
    { href: "/invoices", icon: ReceiptIcon, label: "Invoices" },
    { href: "/scheduling", icon: CalendarIcon, label: "Scheduling" },
    { href: "/payments", icon: CoinsIcon, label: "Payments" },
    { href: "/team", icon: UsersIcon, label: "Team" },
    { href: "/analytics", icon: InfoIcon, label: "Analytics" },
    { href: "/settings", icon: SettingsIcon, label: "Settings" },
  ];

  return (
    <div className="bg-muted/40 border-r">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-[60px] items-center border-b px-6">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <MountainIcon className="h-6 w-6" />
            <span>Acme Business Solutions</span>
          </Link>
          <Button variant="outline" size="icon" className="ml-auto h-8 w-8" aria-label="Toggle notifications">
            <BellIcon className="h-4 w-4" />
            {notifications !== undefined && notifications > 0 && (
              <Badge variant="destructive" className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center">
                {notifications}
              </Badge>
            )}
          </Button>
        </div>
        <OrganizationSwitcher />
        <div className="flex-1 overflow-auto py-2">
          <nav className="grid items-start px-4 text-sm font-medium">
            {links.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${pathname === link.href ? 'bg-muted text-primary' : 'text-muted-foreground'
                    }`}
                >
                  <Icon className="h-4 w-4" />
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </div>
  );
}