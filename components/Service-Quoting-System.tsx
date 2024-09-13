// components/quoting-system.tsx
'use client'

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { getAIEstimate, getVehicleDetails } from '@/lib/api';
import { Service, VehicleDetails as VehicleDetailsType } from '@/types';
import { ServiceSummary } from './Service-Summary';
import { VehicleDetails } from './VehicleDetails';
import { VINScanner } from './VINScanner';

export const QuotingSystem: React.FC = () => {
    const [vehicleDetails, setVehicleDetails] = useState<VehicleDetailsType | null>(null);
    const [selectedServices, setSelectedServices] = useState<Service[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    const handleVINScan = async (vin: string) => {
        setIsLoading(true);
        try {
            const details = await getVehicleDetails(vin);
            setVehicleDetails(details);
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to fetch vehicle details. Please try again.',
                variant: 'destructive',
            });
        } finally {
            setIsLoading(false);
        }
    };


    const handleGetQuote = async () => {
        if (!vehicleDetails || selectedServices.length === 0) {
            toast({
                title: 'Incomplete Information',
                description: 'Please scan a VIN and select at least one service.',
                variant: 'destructive',
            });
            return;
        }

        setIsLoading(true);
        try {
            const estimate = await getAIEstimate(vehicleDetails, selectedServices);
            // Update the selected services with AI estimates
            setSelectedServices(prev => prev.map(service => ({
                ...service,
                estimate: estimate.find(e => e.serviceId === service.id)?.estimate
            })));
            toast({
                title: 'Quote Generated',
                description: 'AI-powered quote has been generated successfully.',
            });
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to generate AI quote. Please try again.',
                variant: 'destructive',
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle>Vehicle Information</CardTitle>
                </CardHeader>
                <CardContent>
                    <VINScanner onScan={handleVINScan} />
                    {vehicleDetails && <VehicleDetails vehicleDetails={vehicleDetails} />}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Service Selection</CardTitle>
                </CardHeader>
                <CardContent>
                    {/* Implement service selection UI here */}
                </CardContent>
            </Card>

            <ServiceSummary services={selectedServices} />

            <Button onClick={handleGetQuote} disabled={isLoading || !vehicleDetails || selectedServices.length === 0}>
                {isLoading ? 'Generating Quote...' : 'Get AI-Powered Quote'}
            </Button>
        </div>
    );
};