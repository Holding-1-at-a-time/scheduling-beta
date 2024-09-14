// components/main-navigation.tsx
import Link from "next/link";
import { UserIcon, HomeIcon, SettingsIcon, LogOutIcon, BellIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function MainNavigation() {
  return (
    <nav className="flex justify-between items-center p-4 bg-gradient-to-r from-primary to-secondary shadow-3d-dark">
      <div className="flex items-center gap-4">
        <Link href="/" className="text-2xl font-bold text-primary-foreground transform hover:scale-105 transition-transform duration-300">
          MyApp
        </Link>
        <div className="hidden md:flex gap-4 text-primary-foreground">
          <Link href="/dashboard" className="flex items-center gap-2 transform hover:scale-110 transition-transform duration-300">
            <HomeIcon className="w-5 h-5" />
            <span>Dashboard</span>
          </Link>
          <Link href="/settings" className="flex items-center gap-2 transform hover:scale-110 transition-transform duration-300">
            <SettingsIcon className="w-5 h-5" />
            <span>Settings</span>
          </Link>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon">
          <BellIcon className="w-6 h-6 text-primary-foreground cursor-pointer transform hover:scale-125 transition-transform duration-300" />
        </Button>
        <Button variant="ghost" size="icon">
          <UserIcon className="w-8 h-8 rounded-full border-2 border-primary-foreground cursor-pointer transform hover:scale-125 transition-transform duration-300" />
        </Button>
        <Link href="/logout" className="flex items-center gap-2 transform hover:scale-110 transition-transform duration-300 text-primary-foreground">
          <LogOutIcon className="w-5 h-5" />
          <span>Logout</span>
        </Link>
      </div>
    </nav>
  );
}