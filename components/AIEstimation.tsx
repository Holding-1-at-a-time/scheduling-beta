// components/ai-estimation.tsx
'use client'

import { useState } from 'react'
import { useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Spinner } from "@/components/ui/spinner"
import { useToast } from '@/hooks/use-toast'

interface AIEstimationProps {
    vehicleDetails: any // Replace with proper type
    selectedServices: string[]
    customizations: any // Replace with proper type
}

export function AIEstimation({ vehicleDetails, selectedServices, customizations }: AIEstimationProps) {
    const [estimationResult, setEstimationResult] = useState<{ estimatedTotal: number, detailedAnalysis: string } | null>(null)
    const calculateEstimate = useMutation(api.estimations.calculate)

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
            useToast({
                title: "Error",
                description: "Failed to calculate estimate",
                variant: "destructive"
            })
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>AI Estimation</CardTitle>
            </CardHeader>
            <CardContent>
                <Button onClick={handleEstimate}>
                    Calculate Estimate
                </Button>
                {calculateEstimate.isLoading && <Spinner className="ml-2" />}
                {estimationResult && (
                    <div className="mt-4">
                        <h3 className="text-lg font-semibold">Estimated Total: ${estimationResult.estimatedTotal.toFixed(2)}</h3>
                        <p className="mt-2">Detailed Analysis: {estimationResult.detailedAnalysis}</p>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}