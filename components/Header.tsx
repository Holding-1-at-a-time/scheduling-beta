// components/header.tsx
"use client"

import Link from 'next/link'
import { useTheme } from 'next-themes'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { MountainIcon, SunIcon, MoonIcon } from 'lucide-react'
import { UserButton, OrganizationSwitcher } from '@clerk/nextjs'

export default function Header() {
  const { theme, setTheme } = useTheme()

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
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <SunIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <MoonIcon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setTheme("light")}>
              Light
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("dark")}>
              Dark
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("system")}>
              System
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <OrganizationSwitcher />
        <UserButton afterSignOutUrl="/" />
      </nav>
    </header>
  )
}