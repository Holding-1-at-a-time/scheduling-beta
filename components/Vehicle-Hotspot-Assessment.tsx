// components/vehicle-hotspot-assessment.tsx
'use client'

import React, { useEffect, useState, useCallback } from 'react'
import { useQuery, useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Spinner } from "@/components/ui/spinner"
import { toast } from "@/components/ui/use-toast"
import { Id } from '@/convex/_generated/dataModel'

interface VehiclePart {
    _id: Id<"vehicleParts">
    name: string
    x: number
    y: number
}

interface Hotspot {
    partId: Id<"vehicleParts">
    issue: string
}

interface VehicleHotspotAssessmentProps {
    vehicleId: Id<"vehicles">
    onAssessment: (assessment: Hotspot[]) => void
}

export function VehicleHotspotAssessment({ vehicleId, onAssessment }: VehicleHotspotAssessmentProps) {
    const vehicleParts = useQuery(api.vehicles.listParts, { vehicleId })
    const [assessment, setAssessment] = useState<Hotspot[]>([])
    const saveAssessment = useMutation(api.vehicles.saveAssessment)

    const handleIssueSubmit = useCallback((partId: Id<"vehicleParts">, issue: string) => {
        setAssessment(prev => {
            const newAssessment = prev.filter(h => h.partId !== partId)
            if (issue) {
                newAssessment.push({ partId, issue })
            }
            return newAssessment
        })
    }, [])

    useEffect(() => {
        onAssessment(assessment)
    }, [assessment, onAssessment])

    const handleSaveAssessment = useCallback(async () => {
        try {
            await saveAssessment({ vehicleId, assessment })
            toast({ title: "Assessment saved successfully" })
        } catch (error) {
            console.error("Error saving assessment:", error)
            toast({ title: "Error saving assessment", variant: "destructive" })
        }
    }, [vehicleId, assessment, saveAssessment])

    if (vehicleParts === undefined) {
        return <Spinner />
    }

    if (vehicleParts === null) {
        return <div>Error loading vehicle parts. Please try again.</div>
    }

    return (
        <div className="space-y-4">
            <div className="relative w-full max-w-[800px] mx-auto aspect-[16/9] rounded-lg overflow-hidden shadow-lg bg-gray-200">
                <img src="/vehicle-outline.svg" alt="Vehicle Diagram" className="w-full h-full object-contain" />
                {vehicleParts.map((part) => (
                    <Popover key={part._id}>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                className={`absolute w-6 h-6 rounded-full ${assessment.some(h => h.partId === part._id) ? 'bg-destructive' : 'bg-primary'
                                    } hover:bg-opacity-80 transition-colors p-0`}
                                style={{ left: `${part.x}%`, top: `${part.y}%` }}
                            >
                                <span className="sr-only">Select {part.name}</span>
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-64">
                            <div className="space-y-2">
                                <Label htmlFor={`issue-${part._id}`}>Issue with {part.name}</Label>
                                <Input
                                    id={`issue-${part._id}`}
                                    placeholder="Describe the issue"
                                    defaultValue={assessment.find(h => h.partId === part._id)?.issue ?? ''}
                                    onBlur={(e) => handleIssueSubmit(part._id, e.target.value)}
                                />
                            </div>
                        </PopoverContent>
                    </Popover>
                ))}
            </div>
            <div className="mt-4">
                <h3 className="font-bold">Reported Issues:</h3>
                <ul className="list-disc pl-5">
                    {assessment.map((hotspot) => {
                        const part = vehicleParts.find(p => p._id === hotspot.partId)
                        return (
                            <li key={hotspot.partId}>
                                {part?.name}: {hotspot.issue}
                            </li>
                        )
                    })}
                </ul>
            </div>
            <Button onClick={handleSaveAssessment}>Save Assessment</Button>
        </div>
    )
}