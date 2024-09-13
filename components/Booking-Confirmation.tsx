// components/booking-confirmation.tsx
'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { useMutation, useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Spinner } from "@/components/ui/spinner"
import { toast } from "@/components/ui/use-toast"

export function BookingConfirmation() {
    const params = useParams()
    const bookingId = params.bookingId as string
    const bookingDetails = useQuery(api.bookings.getById, { id: bookingId })
    const sendConfirmationEmail = useMutation(api.emails.sendConfirmation)

    const handleSendEmail = async () => {
        if (!bookingDetails) return

        try {
            await sendConfirmationEmail({ bookingId })
            toast({ title: "Confirmation email sent successfully" })
        } catch (error) {
            console.error("Error sending confirmation email:", error)
            toast({
                title: "Error",
                description: "Failed to send confirmation email",
                variant: "destructive"
            })
        }
    }

    if (bookingDetails === undefined) {
        return <Spinner />
    }

    if (bookingDetails === null) {
        return <div>Error loading booking details. Please try again.</div>
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Booking Confirmation</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-2">
                    <p><strong>Service:</strong> {bookingDetails.service}</p>
                    <p><strong>Date:</strong> {new Date(bookingDetails.date).toLocaleString()}</p>
                    <Button onClick={handleSendEmail}>Send Confirmation Email</Button>
                </div>
            </CardContent>
        </Card>
    )
}