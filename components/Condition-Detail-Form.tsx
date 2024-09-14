// components/condition-detail-form.tsx
'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import { Spinner } from "@/components/ui/spinner"
import { Id } from '@/convex/_generated/dataModel'
import { useAuth } from '@clerk/nextjs'

interface ConditionDetailFormProps {
    activeHotspot: Id<"vehicleParts">
}

interface FormData {
    issueType: string
    severity: string
}

export function ConditionDetailForm({ activeHotspot }: ConditionDetailFormProps) {
    const { register, handleSubmit, reset } = useForm<FormData>()
    const addConditionDetail = useMutation(api.assessments.addConditionDetail)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const { userId } = useAuth()

    const onSubmit = async (data: FormData) => {
        if (!userId) {
            toast({
                title: "Error",
                description: "You must be logged in to add condition details",
                variant: "destructive"
            })
            return
        }

        setIsSubmitting(true)
        try {
            await addConditionDetail({
                tenantId: userId,
                hotspotId: activeHotspot,
                ...data
            })
            toast({ title: "Condition detail added successfully" })
            reset()
        } catch (error) {
            console.error("Error adding condition detail:", error)
            toast({
                title: "Error",
                description: "Failed to add condition detail",
                variant: "destructive"
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
                <Label htmlFor="issueType">Issue Type</Label>
                <Input
                    id="issueType"
                    {...register('issueType', { required: "Issue type is required" })}
                    placeholder="e.g., Scratch, Dent"
                />
            </div>
            <div>
                <Label htmlFor="severity">Severity</Label>
                <Input
                    id="severity"
                    {...register('severity', { required: "Severity is required" })}
                    placeholder="e.g., Minor, Moderate, Severe"
                />
            </div>
            <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? <Spinner className="mr-2" /> : null}
                Submit
            </Button>
        </form>
    )
}