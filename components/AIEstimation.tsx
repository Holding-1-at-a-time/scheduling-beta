// components/ai-estimation.tsx
import React, { useState } from 'react';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Spinner from './SpinnerComponent';
import { useToast } from './ui/use-toast';
import { formatCurrency } from './utils/format-currency';

interface AIEstimationProps {
    vehicleDetails: {
        make: string;
        model: string;
        year: number;
        condition: string;
    };
    selectedServices: string[];
    customizations: {
        rush: boolean;
        eco: boolean;
    };
}

const AIEstimation: React.FC<AIEstimationProps> = ({ vehicleDetails, selectedServices, customizations }) => {
    const [estimationResult, setEstimationResult] = useState<{ estimatedTotal: number; detailedAnalysis: string } | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { toast } = useToast();

    const calculateEstimate = useMutation(api.estimations.calculate);

    const handleEstimate = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const result = await calculateEstimate({
                vehicleDetails,
                selectedServices,
                customizations,
            });
            setEstimationResult(result);
            toast({
                title: "Estimate calculated successfully",
                description: `Total: ${formatCurrency(result.estimatedTotal)}`,
            });
        } catch (error) {
            console.error("Error calculating estimate:", error);
            setError("Failed to calculate estimate. Please try again.");
            toast({
                title: "Error",
                description: "Failed to calculate estimate",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>AI Estimation</CardTitle>
            </CardHeader>
            <CardContent>
                <Button onClick={handleEstimate} disabled={isLoading}>
                    Calculate Estimate
                    {isLoading && <Spinner className="ml-2" />}
                </Button>
                {error && <p className="text-red-500 mt-2">{error}</p>}
                {estimationResult && (
                    <div className="mt-4">
                        <h3 className="text-lg font-semibold">Estimated Total: {formatCurrency(estimationResult.estimatedTotal)}</h3>
                        <p className="mt-2">Detailed Analysis:</p>
                        <pre className="bg-gray-100 p-2 rounded mt-2 whitespace-pre-wrap">
                            {estimationResult.detailedAnalysis}
                        </pre>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default AIEstimation;