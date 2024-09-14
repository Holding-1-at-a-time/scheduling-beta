// components/quoting-system.tsx
'use client'

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Service } from '@/types';
import { ServiceSummary } from './Service-Summary';
import { VehicleDetails } from './VehicleDetails';
import { VINScanner } from './VINScanner';
import { useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Spinner } from '@/components/ui/spinner';
import { Checkbox } from '@/components/ui/checkbox';

interface VehicleDetailsType {
    make: string;
    model: string;
    year: number;
    type: string;
}

export function QuotingSystem() {
    const [vehicleDetails, setVehicleDetails] = useState<VehicleDetailsType | null>(null);
    const [selectedServices, setSelectedServices] = useState<Service[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    const services = useQuery(api.services.list);
    const getVehicleDetails = useMutation(api.quoting.getVehicleDetails);
    const getAIEstimate = useMutation(api.quoting.getAIEstimate);

    const handleVINScan = async (vin: string) => {
        setIsLoading(true);
        try {
            const details = await getVehicleDetails({ vin });
            setVehicleDetails(details);
            toast({
                title: "Vehicle Details Retrieved",
                description: `Successfully fetched details for ${details.year} ${details.make} ${details.model}`,
            });
        } catch (error) {
            console.error('Error fetching vehicle details:', error);
            toast({
                title: "Error",
                description: "Failed to fetch vehicle details. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleServiceSelection = (service: Service) => {
        setSelectedServices(prev =>
            prev.some(s => s._id === service._id)
                ? prev.filter(s => s._id !== service._id)
                : [...prev, service]
        );
    };

    const handleGetQuote = async () => {
        if (!vehicleDetails || selectedServices.length === 0) {
            toast({
                title: "Incomplete Information",
                description: "Please scan a VIN and select at least one service.",
                variant: "destructive",
            });
            return;
        }

        setIsLoading(true);
        try {
            const estimate = await getAIEstimate({ vehicleDetails, selectedServices });
            const updatedServices = selectedServices.map(service => ({
                ...service,
                estimate: estimate.find(e => e.serviceId === service._id)?.estimate ?? service.price,
            }));
            setSelectedServices(updatedServices);
            toast({
                title: "Quote Generated",
                description: "AI-powered quote has been generated successfully.",
            });
        } catch (error) {
            console.error('Error generating AI quote:', error);
            toast({
                title: "Error",
                description: "Failed to generate AI quote. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    if (!services) {
        return <Spinner />;
    }

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
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {services.map((service) => (
                            <div key={service._id} className="flex items-center space-x-2">
                                <Checkbox
                                    id={service._id}
                                    checked={selectedServices.some(s => s._id === service._id)}
                                    onCheckedChange={() => handleServiceSelection(service)}
                                />
                                <label htmlFor={service._id} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    {service.name} - ${service.price.toFixed(2)}
                                </label>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            <ServiceSummary services={selectedServices} />

            <Button onClick={handleGetQuote} disabled={isLoading || !vehicleDetails || selectedServices.length === 0}>
                {isLoading ? <Spinner className="mr-2 h-4 w-4" /> : null}
                {isLoading ? 'Generating Quote...' : 'Get AI-Powered Quote'}
            </Button>
        </div>
    );
}