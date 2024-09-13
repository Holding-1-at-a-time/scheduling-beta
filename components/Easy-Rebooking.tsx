// components/easy-rebooking.tsx
'use client'

import React, { useState, useCallback } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useUser, useOrganization } from '@clerk/nextjs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { useTranslation } from 'next-i18next';
import { Logger } from '@/lib/logger';
import { PreviousService, BookingSlot } from '@/types/booking';

interface EasyRebookingProps {
    vehicleId: string;
}

export function EasyRebooking({ vehicleId }: EasyRebookingProps) {
    const { t } = useTranslation('common');
    const { user } = useUser();
    const { organization } = useOrganization();
    const [selectedService, setSelectedService] = useState<string | null>(null);
    const [isRebooking, setIsRebooking] = useState(false);

    const previousServices = useQuery(api.services.getPreviousServices, {
        vehicleId,
        userId: user?.id ?? '',
        organizationId: organization?.id ?? '',
    });

    const createBooking = useMutation(api.bookings.createBooking);

    const handleRebook = useCallback(async () => {
        if (!selectedService || !user?.id || !organization?.id) {
            toast({
                title: t('error'),
                description: t('selectServiceError'),
                variant: 'destructive',
            });
            return;
        }

        setIsRebooking(true);

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/rebook`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    serviceId: selectedService,
                    vehicleId,
                    userId: user.id,
                    organizationId: organization.id,
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const { availableSlot }: { availableSlot: BookingSlot } = await response.json();

            const bookingId = await createBooking({
                serviceId: selectedService,
                vehicleId,
                userId: user.id,
                organizationId: organization.id,
                slot: availableSlot,
            });

            toast({
                title: t('bookingConfirmed'),
                description: t('rebookingSuccess'),
            });

            Logger.info('Booking created successfully', { bookingId, userId: user.id, organizationId: organization.id });

        } catch (error) {
            Logger.error('Rebooking error', { error, userId: user.id, organizationId: organization.id });
            toast({
                title: t('rebookingFailed'),
                description: t('rebookingErrorMessage'),
                variant: 'destructive',
            });
        } finally {
            setIsRebooking(false);
        }
    }, [selectedService, user?.id, organization?.id, vehicleId, createBooking, t]);

    if (previousServices === undefined) {
        return <div role="status" aria-live="polite">{t('loadingPreviousServices')}</div>;
    }

    if (previousServices === null || previousServices.length === 0) {
        return <div role="status">{t('noPreviousServices')}</div>;
    }

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>{t('easyRebooking')}</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <Select onValueChange={(value: string) => setSelectedService(value)}>
                        <SelectTrigger aria-label={t('selectPreviousService')}>
                            <SelectValue placeholder={t('selectPreviousServicePlaceholder')} />
                        </SelectTrigger>
                        <SelectContent>
                            {previousServices.map((service: PreviousService) => (
                                <SelectItem key={service.id} value={service.id}>
                                    {service.name} - {format(parseISO(service.date), 'PPP')}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Button
                        onClick={handleRebook}
                        disabled={!selectedService || isRebooking}
                        className="w-full"
                        aria-busy={isRebooking}
                    >
                        {isRebooking ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                                {t('rebooking')}
                            </>
                        ) : (
                            t('rebookSelectedService')
                        )}
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}