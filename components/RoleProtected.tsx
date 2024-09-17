// File: components/RoleProtected.tsx
import { hasPermission } from "@/lib/auth";
import { Permission } from "@/types/auth";
import { useUser } from "@clerk/nextjs";
import { ReactNode, useEffect, useState } from "react";
import ErrorBoundary from "./ErrorBoundary";

interface RoleProtectedProps {
    children: ReactNode;
    requiredPermission: Permission;
    fallback?: ReactNode;
}

export function RoleProtected({ children, requiredPermission, fallback = <div>Access Denied</div> }: RoleProtectedProps) {
    const { isLoaded, isSignedIn } = useUser();
    const [hasAccess, setHasAccess] = useState<boolean | null>(null);

    useEffect(() => {
        let isMounted = true;
        if (isLoaded && isSignedIn) {
            hasPermission(requiredPermission)
                .then((result) => {
                    if (isMounted) setHasAccess(result);
                })
                .catch((error) => {
                    console.error('Error checking permission:', error);
                    if (isMounted) setHasAccess(false);
                });
        }
        return () => { isMounted = false; };
    }, [isLoaded, isSignedIn, requiredPermission]);

    if (!isLoaded) return <div>Loading...</div>;
    if (!isSignedIn) return <div>Please sign in</div>;
    if (hasAccess === null) return <div>Checking permissions...</div>;

    return (
        <ErrorBoundary fallback={<div>An error occurred. Please try again later.</div>}>
            {hasAccess ? children : fallback}
        </ErrorBoundary>
    );
} 