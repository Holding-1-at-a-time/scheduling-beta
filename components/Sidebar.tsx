// components/sidebar.tsx
"use client";

import Link from 'next/link';
<<<<<<< HEAD
=======
import { usePathname } from 'next/navigation';
>>>>>>> development
import { BellIcon, BriefcaseIcon, CalendarIcon, CoinsIcon, HomeIcon, InfoIcon, MountainIcon, ReceiptIcon, SettingsIcon, UsersIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { OrganizationSwitcher } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
<<<<<<< HEAD

export default function Sidebar() {
  return (
    <div className="bg-muted/40 border-r">
      <div className="flex h-full max-h-screen flex-col gap-2 parallax">
=======
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
>>>>>>> development
        <div className="flex h-[60px] items-center border-b px-6">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <MountainIcon className="h-6 w-6" />
            <span>Acme Business Solutions</span>
          </Link>
<<<<<<< HEAD
          <Button variant="outline" size="icon" className="ml-auto h-8 w-8">
            <BellIcon className="h-4 w-4" />
            <span className="sr-only">Toggle notifications</span>
=======
          <Button variant="outline" size="icon" className="ml-auto h-8 w-8" aria-label="Toggle notifications">
            <BellIcon className="h-4 w-4" />
            {notifications !== undefined && notifications > 0 && (
              <Badge variant="destructive" className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center">
                {notifications}
              </Badge>
            )}
>>>>>>> development
          </Button>
        </div>
        <OrganizationSwitcher />
        <div className="flex-1 overflow-auto py-2">
          <nav className="grid items-start px-4 text-sm font-medium">
<<<<<<< HEAD
            <Link href="/" className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary pulse">
              <HomeIcon className="h-4 w-4" />
              Dashboard
            </Link>
            <Link href="/clients" className="flex items-center gap-3 rounded-lg bg-muted px-3 py-2 text-primary transition-all hover:text-primary slide-in">
              <BriefcaseIcon className="h-4 w-4" />
              Clients
              <Badge className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full">12</Badge>
            </Link>
            <Link href="/invoices" className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary zoom-in">
              <ReceiptIcon className="h-4 w-4" />
              Invoices
            </Link>
            <Link href="/scheduling" className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary rotate-in">
              <CalendarIcon className="h-4 w-4" />
              Scheduling
            </Link>
            <Link href="/payments" className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary">
              <CoinsIcon className="h-4 w-4" />
              Payments
            </Link>
            <Link href="/team" className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary">
              <UsersIcon className="h-4 w-4" />
              Team
            </Link>
            <Link href="/analytics" className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary">
              <InfoIcon className="h-4 w-4" />
              Analytics
            </Link>
            <Link href="/settings" className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary">
              <SettingsIcon className="h-4 w-4" />
              Settings
            </Link>
=======
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
>>>>>>> development
          </nav>
        </div>
      </div>
    </div>
  );
}