// app/error.tsx
'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="text-center">
        <AlertTriangle className="w-16 h-16 text-destructive mx-auto" />
        <h2 className="mt-4 text-2xl font-semibold text-foreground">Something went wrong!</h2>
        <p className="mt-2 text-muted-foreground">An error occurred while loading this page.</p>
        <div className="mt-6 space-x-4">
          <Button onClick={reset}>Try again</Button>
          <Button variant="outline" asChild>
            <a href="/">Return to Home</a>
          </Button>
        </div>
      </div>
    </div>
  );
}