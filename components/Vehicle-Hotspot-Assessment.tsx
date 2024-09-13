// components/vehicle-hotspot-assessment.tsx
'use client'

import React, { useEffect, useState } from 'react'
import { useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Spinner } from "@/components/ui/spinner"
import { Id } from '@/convex/_generated/dataModel'

interface VehiclePart {
    _id: Id<"vehicleParts">
    name: string
    x: number
    y: number
}

interface Hotspot {
    part: string
    issue: string
}

interface VehicleHotspotAssessmentProps {
    onAssessment: (assessment: Hotspot[]) => void
}

export function VehicleHotspotAssessment({ onAssessment }: VehicleHotspotAssessmentProps) {
    const vehicleParts = useQuery(api.vehicles.list)
    const [activeHotspot, setActiveHotspot] = useState<VehiclePart | null>(null)
    const [assessment, setAssessment] = useState<Hotspot[]>([])

    useEffect(() => {
        onAssessment(assessment)
    }, [assessment, onAssessment])

    const handleHotspotClick = (part: VehiclePart) => {
        setActiveHotspot(part)
    }

    const handleIssueSubmit = (issue: string) => {
        if (activeHotspot) {
            const newHotspot: Hotspot = { part: activeHotspot.name, issue }
            setAssessment(prev => [...prev.filter(h => h.part !== activeHotspot.name), newHotspot])
            setActiveHotspot(null)
        }
    }

    if (vehicleParts === undefined) {
        return <Spinner />
    }

    if (vehicleParts === null) {
        return <div>Error loading vehicle parts. Please try again.</div>
    }

    return (
        <div className="relative w-full max-w-[800px] mx-auto">
            <div className="relative w-full aspect-[16/9] rounded-lg overflow-hidden shadow-lg bg-gray-200">
                <img src="/vehicle-outline.svg" alt="Vehicle Diagram" className="w-full h-full object-contain" />
                {vehicleParts.map((part) => (
                    <Popover key={part._id}>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                className={`absolute w-6 h-6 rounded-full ${assessment.some(h => h.part === part.name) ? 'bg-destructive' : 'bg-primary'
                                    } hover:bg-opacity-80 transition-colors p-0`}
                                style={{ left: `${part.x}%`, top: `${part.y}%` }}
                                onClick={() => handleHotspotClick(part)}
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
                                    defaultValue={assessment.find(h => h.part === part.name)?.issue ?? ''}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            handleIssueSubmit((e.target as HTMLInputElement).value)
                                        }
                                    }}
                                />
                                <Button onClick={() => handleIssueSubmit((document.getElementById(`issue-${part._id}`) as HTMLInputElement).value)}>
                                    Submit
                                </Button>
                            </div>
                        </PopoverContent>
                    </Popover>
                ))}
            </div>
            <div className="mt-4">
                <h3 className="font-bold">Reported Issues:</h3>
                <ul className="list-disc pl-5">
                    {assessment.map((hotspot, index) => (
                        <li key={index}>
                            {hotspot.part}: {hotspot.issue}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}