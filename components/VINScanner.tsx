// components/vin-scanner.tsx
'use client'

import React, { useEffect, useRef, useState } from 'react';
import Quagga from 'quagga';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import { useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';

interface VINScannerProps {
    tenantId: Id<"tenants">;
}

export const VINScanner: React.FC<VINScannerProps> = ({ tenantId }) => {
    const scannerRef = useRef<HTMLDivElement>(null);
    const [isScanning, setIsScanning] = useState(false);
    const [manualVIN, setManualVIN] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);

    const createVehicleProfile = useMutation(api.vehicles.createVehicleProfile);
    const decodeVIN = useMutation(api.vehicles.decodeVIN);

    useEffect(() => {
        if (isScanning && scannerRef.current) {
            Quagga.init({
                inputStream: {
                    type: 'LiveStream',
                    target: scannerRef.current,
                    constraints: {
                        width: 480,
                        height: 320,
                        facingMode: 'environment',
                    },
                },
                decoder: {
                    readers: ['code_128_reader'],
                },
            }, (err) => {
                if (err) {
                    console.error(err);
                    toast({
                        title: 'Scanner Error',
                        description: 'Failed to initialize the scanner. Please try again or enter the VIN manually.',
                        variant: 'destructive',
                    });
                    setIsScanning(false);
                    return;
                }
                Quagga.start();
            });

            Quagga.onDetected((data) => {
                const vin = data.codeResult.code;
                if (validateVIN(vin)) {
                    handleVINProcessing(vin);
                    setIsScanning(false);
                    Quagga.stop();
                }
            });

            return () => {
                Quagga.stop();
            };
        }
    }, [isScanning]);

    const handleManualSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (validateVIN(manualVIN)) {
            await handleVINProcessing(manualVIN);
        } else {
            toast({
                title: 'Invalid VIN',
                description: 'Please enter a valid 17-character VIN.',
                variant: 'destructive',
            });
        }
    };

    const handleVINProcessing = async (vin: string) => {
        setIsProcessing(true);
        try {
            const decodedInfo = await decodeVIN({ vin });
            await createVehicleProfile({
                tenantId,
                vin,
                ...decodedInfo,
            });
            toast({
                title: 'Success',
                description: `Vehicle profile created for VIN: ${vin}`,
            });
        } catch (error) {
            console.error('Error processing VIN:', error);
            toast({
                title: 'Error',
                description: error instanceof Error ? error.message : 'An unknown error occurred',
                variant: 'destructive',
            });
        } finally {
            setIsProcessing(false);
            setManualVIN('');
        }
    };

    const validateVIN = (vin: string): boolean => {
        return /^[A-HJ-NPR-Z0-9]{17}$/.test(vin);
    };

    return (
        <div className="space-y-4">
            <div className="flex space-x-2">
                <Button onClick={() => setIsScanning(!isScanning)} disabled={isProcessing}>
                    {isScanning ? 'Stop Scanning' : 'Start Scanning'}
                </Button>
                <form onSubmit={handleManualSubmit} className="flex-1 flex space-x-2">
                    <Input
                        type="text"
                        placeholder="Enter VIN manually"
                        value={manualVIN}
                        onChange={(e) => setManualVIN(e.target.value.toUpperCase())}
                        maxLength={17}
                        disabled={isProcessing}
                    />
                    <Button type="submit" disabled={isProcessing}>
                        {isProcessing ? 'Processing...' : 'Submit'}
                    </Button>
                </form>
            </div>
            {isScanning && (
                <div ref={scannerRef} className="w-full h-80 bg-gray-200 flex items-center justify-center">
                    <p>Scanning for VIN...</p>
                </div>
            )}
        </div>
    );
};