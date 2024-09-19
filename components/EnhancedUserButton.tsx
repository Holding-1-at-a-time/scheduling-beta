import React, { useState } from 'react';
import { UserButton, useUser } from "@clerk/nextjs";
import { useToast } from "@/components/ui/use-toast";
import LoadingSpinner from '@/components/LoadingSpinner';
import { toErrorWithMessage } from '@/types';

export const EnhancedUserButton: React.FC = () => {
    const { user, isLoaded, isSignedIn } = useUser();
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    if (!isLoaded) {
        return <LoadingSpinner />;
    }

    if (!isSignedIn) {
        return null;
    }

    const handleSignOut = async () => {
        setIsLoading(true);
        try {
            await user?.signOut();
            toast({
                title: "Signed out successfully",
                description: "We hope to see you again soon!",
            });
        } catch (error) {
            console.error("Error signing out:", toErrorWithMessage(error));
            toast({
                title: "Error signing out",
                description: "Please try again later.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <UserButton
            afterSignOutUrl="/"
            signInUrl="/sign-in"
            userProfileUrl="/profile"
            userProfileMode="modal"
            appearance={{
                elements: {
                    avatarBox: "h-10 w-10",
                },
            }}
            disabled={isLoading}
        />
    );
};