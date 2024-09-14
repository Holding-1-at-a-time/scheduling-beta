// components/ai-estimation.tsx
'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { api } from '@/convex/_generated/api'
import { useMutation } from 'convex/react'
import { useState } from 'react'
import Spinner from './SpinnerComponent'
import { useToast } from './ui/use-toast'
import { formatCurrency } from './utils/format-currency'

interface AIEstimationProps {
    vehicleDetails: VehicleDetailsType;
    selectedServices: Array<ServiceType>;
    customizations: CustomizationsType;
}

const AIEstimation = ({ vehicleDetails, selectedServices, customizations }: AIEstimationProps) => {
    const [estimationResult, setEstimationResult] = useState<{ estimatedTotal: number, detailedAnalysis: string } | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [retryCount, setRetryCount] = useState(0)
    const formattedTotal = formatCurrency(estimationResult.estimatedTotal, 'en-US', 'USD');

    const calculateEstimate = useMutation(api.estimations.calculate, {
        onMutate: () => {
            setIsLoading(true)
            setError(null)
        },
        onSuccess: (result) => {
            setIsLoading(false)
            setEstimationResult(result)
        },
        onError: (err) => {
            setIsLoading(false)
            setError(err.message)
            setRetryCount(retryCount + 1)
        },
    })

    const handleEstimate = async () => {
        try {
            const result = await calculateEstimate({
                vehicleDetails,
                selectedServices,
                customizations,
            })
            setEstimationResult(result)
            useToast({ title: "Estimate calculated successfully" })
        } catch (error) {
            console.error("Error calculating estimate:", error)
            setError(error.message)
            useToast({
                title: "Error",
                description: "Failed to calculate estimate",
                variant: "destructive"
            })
        }
    }

    const handleRetry = async () => {
        if (retryCount < 3) {
            handleEstimate()
        } else {
            setError("Failed to calculate estimate after multiple attempts. Please try again later.")
        }
    }

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
                {error && (
                    <div className="mt-2">
                        <p className="text-red-500">{error}</p>
                        <Button onClick={handleRetry} className="mt-2">
                            Retry
                        </Button>
                    </div>
                )}
                {estimationResult && (
                    <div className="mt-4">
                        <h3 className="text-lg font-semibold">Estimated Total: {formatCurrency(estimationResult.estimatedTotal)}</h3>
                        <p className="mt-2">Detailed Analysis:</p>
                        <details>
                            <summary>View detailed analysis</summary>
                            <p>{estimationResult.detailedAnalysis}</p>
                        </details>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}

export default AIEstimation