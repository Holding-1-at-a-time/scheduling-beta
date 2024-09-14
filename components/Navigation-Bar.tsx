// components/navigation-bar.tsx
"use client";

import { UserButton, useUser } from "@clerk/nextjs";
import { HomeIcon, SettingsIcon } from "lucide-react";
import Link from "next/link";

export default function NavigationBar() {
  const { isLoaded, isSignedIn } = useUser();

  return (
    <nav className="flex items-center justify-between p-4 bg-gradient-to-r from-primary to-primary-light shadow-lg">
      <div className="flex items-center space-x-4">
        <Link href="/" className="flex items-center space-x-2 text-white">
          <HomeIcon className="w-6 h-6" />
          <span>Home</span>
        </Link>
        <Link href="/settings" className="flex items-center space-x-2 text-white">
          <SettingsIcon className="w-6 h-6" />
          <span>Settings</span>
        </Link>
      </div>
      <div className="flex items-center space-x-4">
        {isLoaded && isSignedIn ? (
          <UserButton afterSignOutUrl="/" />
        ) : (
          <Link href="/sign-in" className="text-white">
            Sign In
          </Link>
        )}
      </div>
    </nav>
  );
}