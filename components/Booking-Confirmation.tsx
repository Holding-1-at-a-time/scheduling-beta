
// components/booking-confirmation.tsx
import React from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { useToast } from "@/components/ui/use-toast";
import { useParams } from 'next/navigation';

export function BookingConfirmation() {
    const params = useParams();
    const bookingId = params.bookingId as string;
    const bookingDetails = useQuery(api.bookings.getById, { id: bookingId });
    const sendConfirmationEmail = useMutation(api.bookings.sendConfirmationEmail);
    const { toast } = useToast();

    const handleSendEmail = async () => {
        if (!bookingDetails) {
            return;
        }
        try {
            await sendConfirmationEmail({ bookingId });
            toast({
                title: "Confirmation Sent",
                description: "Confirmation email sent successfully",
            });
        } catch (error) {
            console.error("Error sending confirmation email:", error);
            toast({
                title: "Error",
                description: "Failed to send confirmation email. Please try again.",
                variant: "destructive",
            });
        }
    };

    if (bookingDetails === undefined) {
        return <Spinner />;
    }

    if (bookingDetails === null) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Booking Not Found</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>The requested booking could not be found. Please check the booking ID and try again.</p>
                </CardContent>
            </Card>
        );
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
                    <p><strong>Status:</strong> {bookingDetails.status}</p>
                    <Button onClick={handleSendEmail}>Send Confirmation Email</Button>
                </div>
            </CardContent>
        </Card>
    );
}
