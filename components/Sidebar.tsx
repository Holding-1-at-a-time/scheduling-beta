// components/sidebar.tsx
"use client";

import Link from 'next/link';
import { BellIcon, BriefcaseIcon, CalendarIcon, CoinsIcon, HomeIcon, InfoIcon, MountainIcon, ReceiptIcon, SettingsIcon, UsersIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { OrganizationSwitcher } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';

export default function Sidebar() {
  return (
    <div className="bg-muted/40 border-r">
      <div className="flex h-full max-h-screen flex-col gap-2 parallax">
        <div className="flex h-[60px] items-center border-b px-6">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <MountainIcon className="h-6 w-6" />
            <span>Acme Business Solutions</span>
          </Link>
          <Button variant="outline" size="icon" className="ml-auto h-8 w-8">
            <BellIcon className="h-4 w-4" />
            <span className="sr-only">Toggle notifications</span>
          </Button>
        </div>
        <OrganizationSwitcher />
        <div className="flex-1 overflow-auto py-2">
          <nav className="grid items-start px-4 text-sm font-medium">
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
          </nav>
        </div>
      </div>
    </div>
  );
}