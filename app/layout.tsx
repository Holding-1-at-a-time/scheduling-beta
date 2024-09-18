import { Toaster } from "@/components/ui/toaster";
import { ClerkProvider } from '@clerk/nextjs';
import { ConvexProviderWithAuth, ConvexReactClient } from "convex/react";
import type { Metadata } from "next";
import { Libre_Baskerville, Poppins } from 'next/font/google';
import "./globals.css";
import { ConvexClient } from "convex/browser";

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
      <ConvexProviderWithClerk>
        <html lang="en">
          <body>
            {children}
            <Toaster />
          </body>
        </html>
      </ConvexProviderWithClerk>
    </ClerkProvider>
  );
}
