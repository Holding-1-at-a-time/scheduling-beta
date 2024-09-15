import React, { useState } from 'react';
import { CreateOrganization } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import ErrorBoundary from '@/components/ErrorBoundary';
import LoadingSpinner from '@/components/LoadingSpinner';
import { toErrorWithMessage } from '@/types';
import { useMutation } from '@/convex/_generated/react';

const CreateOrganizationPage: React.FC = () => {
    const router = useRouter();
    const [isCreating, setIsCreating] = useState(false);
    const { toast } = useToast();
    const syncOrganization = useMutation('organizations.syncOrganization');

    const handleCreateOrganization = async (organizationId: string) => {
        setIsCreating(true);
        try {
            await syncOrganization({ organizationId });
            toast({
                title: "Organization created successfully",
                description: "You can now start managing your organization.",
            });
            router.push(`/${organizationId}/dashboard`);
        } catch (error) {
            console.error("Error creating organization:", toErrorWithMessage(error));
            toast({
                title: "Error creating organization",
                description: "Please try again later.",
                variant: "destructive",
            });
        } finally {
            setIsCreating(false);
        }
    };

    return (
        <ErrorBoundary fallback={<div>Something went wrong. Please try again later.</div>}>
            <React.Suspense fallback={<LoadingSpinner />}>
                <div className="flex items-center justify-center min-h-screen bg-gray-100">
                    <CreateOrganization
                        path="/create-organization"
                        routing="path"
                        afterCreateOrganizationUrl={handleCreateOrganization}
                        appearance={{
                            elements: {
                                formButtonPrimary: "bg-blue-500 hover:bg-blue-600 text-white",
                            },
                        }}
                    />
                </div>
            </React.Suspense>
        </ErrorBoundary>
    );
};

export default CreateOrganizationPage;