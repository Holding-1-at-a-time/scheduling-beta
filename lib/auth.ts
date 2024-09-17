import { createLogger } from '@/lib/logger';// File: lib/auth.ts
import { auth, clerkClient } from "@clerk/nextjs/server";
import { UserMetadata, Permission, rolePermissions } from "@/types/auth";
import { cache } from 'react';

const logger = createLogger('useAuth');

export const getUserMetadata = cache(async (): Promise<UserMetadata | null> => {
    const { userId } = auth();
    if (!userId) return null;

    try {
        const user = await clerkClient.users.getUser(userId);
        const metadata = user.publicMetadata as UserMetadata;

        // Update last login time
        await clerkClient.users.updateUserMetadata(userId, {
            publicMetadata: {
                ...metadata,
                lastLogin: new Date().toISOString(),
            },
        });

        return metadata;
    } catch (error) {
        logger.error('Error fetching user metadata', { error, userId });
        throw new Error('Failed to fetch user metadata');
    }
});

export async function hasPermission(permission: Permission): Promise<boolean> {
    const metadata = await getUserMetadata();
    if (!metadata) return false;

    const userPermissions = rolePermissions[metadata.role];
    return userPermissions.includes(permission);
}

export async function updateUserPreferences(preferredLanguage: string): Promise<void> {
    const { userId } = auth();
    if (!userId) throw new Error('User not authenticated');

    try {
        await clerkClient.users.updateUserMetadata(userId, {
            publicMetadata: {
                preferredLanguage,
            },
        });
    } catch (error) {
        logger.error('Error updating user preferences', { error, userId });
        throw new Error('Failed to update user preferences');
    }
}