// components/vin-scanner.tsx
'use client'

import React, { useEffect, useRef, useState, useCallback } from 'react';
import Quagga from 'quagga';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';

interface VINScannerProps {
    onScan: (vin: string) => void;
}

export const VINScanner: React.FC<VINScannerProps> = ({ onScan }) => {
    const scannerRef = useRef<HTMLDivElement>(null);
    const [isScanning, setIsScanning] = useState(false);
    const [manualVIN, setManualVIN] = useState('');
    const validateVIN = useMutation(api.vehicles.validateVIN);

    const startScanner = useCallback(() => {
        if (scannerRef.current) {
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

            Quagga.onDetected(async (data) => {
                const scannedVIN = data.codeResult.code;
                try {
                    const isValid = await validateVIN({ vin: scannedVIN });
                    if (isValid) {
                        onScan(scannedVIN);
                        setIsScanning(false);
                        Quagga.stop();
                        toast({
                            title: 'VIN Scanned',
                            description: `Successfully scanned VIN: ${scannedVIN}`,
                        });
                    } else {
                        toast({
                            title: 'Invalid VIN',
                            description: 'The scanned VIN is not valid. Please try again.',
                            variant: 'destructive',
                        });
                    }
                } catch (error) {
                    console.error('Error validating VIN:', error);
                    toast({
                        title: 'Validation Error',
                        description: 'Failed to validate the scanned VIN. Please try again or enter manually.',
                        variant: 'destructive',
                    });
                }
            });
        }
    }, [onScan, validateVIN]);

    useEffect(() => {
        if (isScanning) {
            startScanner();
        } else {
            Quagga.stop();
        }

        return () => {
            Quagga.stop();
        };
    }, [isScanning, startScanner]);

    const handleManualSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const isValid = await validateVIN({ vin: manualVIN });
            if (isValid) {
                onScan(manualVIN);
                toast({
                    title: 'VIN Submitted',
                    description: `Successfully submitted VIN: ${manualVIN}`,
                });
                setManualVIN('');
            } else {
                toast({
                    title: 'Invalid VIN',
                    description: 'Please enter a valid 17-character VIN.',
                    variant: 'destructive',
                });
            }
        } catch (error) {
            console.error('Error validating VIN:', error);
            toast({
                title: 'Validation Error',
                description: 'Failed to validate the entered VIN. Please try again.',
                variant: 'destructive',
            });
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex space-x-2">
                <Button onClick={() => setIsScanning(!isScanning)}>
                    {isScanning ? 'Stop Scanning' : 'Start Scanning'}
                </Button>
                <form onSubmit={handleManualSubmit} className="flex-1 flex space-x-2">
                    <Input
                        type="text"
                        placeholder="Enter VIN manually"
                        value={manualVIN}
                        onChange={(e) => setManualVIN(e.target.value.toUpperCase())}
                        maxLength={17}
                    />
                    <Button type="submit">Submit</Button>
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