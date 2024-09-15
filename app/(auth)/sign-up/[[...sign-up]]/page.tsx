import React from 'react';
import { SignUp } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import ErrorBoundary from '@/components/ErrorBoundary';
import LoadingSpinner from '@/components/LoadingSpinner';

const SignUpPage: React.FC = () => {
    const router = useRouter();

    return (
        <ErrorBoundary fallback={<div>Something went wrong. Please try again later.</div>}>
            <React.Suspense fallback={<LoadingSpinner />}>
                <div className="flex items-center justify-center min-h-screen bg-gray-100">
                    <SignUp
                        path="/sign-up"
                        routing="path"
                        signInUrl="/sign-in"
                        afterSignUpUrl="/dashboard"
                        appearance={{
                            elements: {
                                formButtonPrimary: "bg-green-500 hover:bg-green-600 text-white",
                            },
                        }}
                    />
                </div>
            </React.Suspense>
        </ErrorBoundary>
    );
};

export default SignUpPage;