"use client";

import { UserButton, useUser } from "@clerk/nextjs";
import { HomeIcon, SettingsIcon, BarChartIcon, CalendarIcon, UsersIcon } from "lucide-react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";


const navItems = [
  { href: "/", icon: HomeIcon, label: "Home" },
  { href: "/appointments", icon: CalendarIcon, label: "Appointments" },
  { href: "/customers", icon: UsersIcon, label: "Customers" },
  { href: "/analytics", icon: BarChartIcon, label: "Analytics" },
  { href: "/settings", icon: SettingsIcon, label: "Settings" },
];

export default function NavigationBar() {
  const { isSignedIn, user, isLoaded } = useUser();
  const router = useRouter();
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!isLoaded) {
    return <div className="h-16 bg-primary animate-pulse" aria-label="Loading navigation bar" />;
  }

  const handleSignIn = () => {
    router.push("/sign-in");
  };



  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between p-4 transition-all duration-300 ${isScrolled ? "bg-primary shadow-lg" : "bg-transparent"
        }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 120, damping: 20 }}
    >
      <div className="flex items-center space-x-4">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center space-x-2 text-white transition-colors duration-200 hover:text-primary-light ${pathname === item.href ? "font-bold" : ""
              }`}
          >
            <item.icon className="w-5 h-5" aria-hidden="true" />
            <span className="hidden md:inline">{item.label}</span>
          </Link>
        ))}
      </div>
      <div className="flex items-center space-x-4">
        {isSignedIn ? (
          <div className="flex items-center space-x-4">
            <span className="text-white hidden md:inline">Hello, {user.fullName}!</span>
            <UserButton
              afterSignOutUrl="/"
              appearance={{
                elements: {
                  avatarBox: "w-10 h-10",
                },
              }}
            />
          </div>
        ) : (
          <button
            onClick={handleSignIn}
            className="px-4 py-2 text-white bg-primary-light rounded-md hover:bg-primary-dark transition-colors duration-200"
          >
            Sign In
          </button>
        )}
      </div>
    </motion.nav>
  );
}