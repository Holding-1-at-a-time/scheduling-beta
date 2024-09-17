import React from 'react';
import { SignIn } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import ErrorBoundary from '@/components/ErrorBoundary';
import LoadingSpinner from '@/components/LoadingSpinner';

const SignInPage: React.FC = () => {

    return (
        <ErrorBoundary fallback={<div>Something went wrong. Please try again later.</div>}>
            <React.Suspense fallback={<LoadingSpinner />}>
                <div className="flex items-center justify-center min-h-screen bg-gray-100">
                    <SignIn
                        path="/sign-in"
                        routing="path"
                        signUpUrl="/sign-up"
                        afterSignInUrl="/dashboard"
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

export default SignInPage;
