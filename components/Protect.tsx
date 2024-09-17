import React, { ReactNode } from 'react';
import { useUser } from "@clerk/nextjs";
import LoadingSpinner from '@/components/LoadingSpinner';

interface ProtectProps {
    children: ReactNode;
    fallback?: ReactNode;
    permission?: string;
    role?: string;
}

export const Protect: React.FC<ProtectProps> = ({ children, fallback, permission, role }) => {
    const { user, isLoaded } = useUser();

    if (!isLoaded) {
        return <LoadingSpinner />;
    }

    const hasPermission = permission ? user?.publicMetadata[permission] === true : true;
    const hasRole = role ? user?.publicMetadata.role === role : true;

    if (hasPermission && hasRole) {
        return <>{children}</>;
    }

    return fallback ? <>{fallback}</> : null;
};