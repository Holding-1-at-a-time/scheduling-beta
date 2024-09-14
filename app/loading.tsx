// app/loading.tsx
import { Loader2, LucideLoader2 } from 'lucide-react';

export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="text-center">
        <LucideLoader2 className="w-16 h-16 animate-spin text-primary mx-auto" />
        <h2 className="mt-4 text-xl font-semibold text-foreground">Loading...</h2>
        <p className="mt-2 text-muted-foreground">Please wait while we prepare your content.</p>
      </div>
    </div>
  );
}