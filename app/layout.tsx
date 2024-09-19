import { Toaster } from "@/components/ui/toaster";
import type { Metadata } from "next";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import { Libre_Baskerville, Poppins } from 'next/font/google';
import NavigationBar from '@/components/Navigation-Bar';
import "./globals.css";
import ConvexClerkProvider from "./ConvexClerkProvider";
import { ThemeProvider } from "@/components/Theme-Provider";

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
    <ConvexClerkProvider>
      <html lang="en" className={`${fontHeading.variable} ${fontBody.variable}`}>
        <body className={fontBody.className}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <ErrorBoundary errorComponent={ErrorFallback}>
              <div className="flex flex-col min-h-screen">
                <NavigationBar />
                <main className="flex-grow">
                  {children}
                </main>
                <footer className="py-4 text-center bg-gray-100">
                  <p>&copy; {new Date().getFullYear()} Detail Synce. All rights reserved.</p>
                </footer>
              </div>
            </ErrorBoundary>
            <Toaster />
          </ThemeProvider>
        </body>
      </html>
    </ConvexClerkProvider>
  );
}

function ErrorFallback({ error }: { error: Error }) {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold text-red-600 mb-4">Oops! Something went wrong.</h1>
      <p className="text-gray-600 mb-4">{error.message}</p>
      <button
        onClick={() => window.location.reload()}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
      >
        Try again
      </button>
    </div>
  );
}