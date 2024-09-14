// app/not-found.tsx
import Link from 'next/link';
import React from 'react';

export default function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-primary">404</h1>
        <h2 className="mt-2 text-2xl font-semibold text-foreground">Page Not Found</h2>
        <p className="mt-4 text-muted-foreground">Sorry, we couldn't find the page you're looking for.</p>
        <button asChild className="mt-6">
          <Link href="/">
            Return to Home
          </Link>
        </button>
      </div>
    </div>
  );
}