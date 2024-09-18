import type { Metadata } from "next";
import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton
} from '@clerk/nextjs'
import "./globals.css";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { ConvexClientProvider } from "./ConvexClientProvider";
import { Analytics } from "@vercel/analytics/react"
import { Libre_Baskerville } from 'next/font/google'
import { Poppins } from 'next/font/google'
import { cn } from '@/lib/utils';

const fontHeading = Libre_Baskerville({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-heading',
})

const fontBody = Poppins({
  subsets: ['latin'],
  weight: ['400', '700'],
  display: 'swap',
  variable: '--font-body',
})


export const metadata: Metadata = {
  title: "Detail Synce",
  description: "Revolutionalize One Detail Business At A Time",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <ConvexProvider>
        <html lang="en">
          <body>
            {children}
            <Toaster />
          </body>
        </html>
      </ConvexProvider>
    </ClerkProvider>
  );
}
