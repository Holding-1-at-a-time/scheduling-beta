// components/header.tsx
"use client";

import Link from 'next/link';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MountainIcon } from '@/components/icons';
import { UserButton, OrganizationSwitcher } from '@clerk/nextjs';

export default function Header() {
  return (
    <header className="bg-primary text-primary-foreground py-4 px-6 flex items-center justify-between animated-3d">
      <Link href="/" className="flex items-center gap-2 font-semibold text-lg">
        <MountainIcon className="h-6 w-6" />
        <span>Acme Business Solutions</span>
      </Link>
      <nav className="flex items-center gap-4">
        <Link href="/features" className="text-sm font-medium hover:underline underline-offset-4">
          Features
        </Link>
        <Link href="/pricing" className="text-sm font-medium hover:underline underline-offset-4">
          Pricing
        </Link>
        <Link href="/about" className="text-sm font-medium hover:underline underline-offset-4">
          About
        </Link>
        <Link href="/contact" className="text-sm font-medium hover:underline underline-offset-4">
          Contact
        </Link>
        <OrganizationSwitcher />
        <UserButton afterSignOutUrl="/" />
      </nav>
    </header>
  );
}