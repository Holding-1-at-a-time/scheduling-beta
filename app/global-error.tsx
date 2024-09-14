// app/global-error.tsx
'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertOctagon } from 'lucide-react';

export default function GlobalError({
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
    <html>
      <body>
        <div className="flex items-center justify-center min-h-screen bg-background">
          <div className="text-center">
            <AlertOctagon className="w-16 h-16 text-destructive mx-auto" />
            <h2 className="mt-4 text-2xl font-semibold text-foreground">A critical error occurred</h2>
            <p className="mt-2 text-muted-foreground">We apologize for the inconvenience. Our team has been notified.</p>
            <div className="mt-6 space-x-4">
              <Button onClick={reset}>Try again</Button>
              <Button variant="outline" onClick={() => window.location.href = '/'}>Return to Home</Button>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}