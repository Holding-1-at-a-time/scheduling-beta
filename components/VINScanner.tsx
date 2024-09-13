// components/vin-scanner.tsx
'use client'

import React, { useEffect, useRef, useState } from 'react';
import Quagga from 'quagga';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';

interface VINScannerProps {
    onScan: (vin: string) => void;
}

export const VINScanner: React.FC<VINScannerProps> = ({ onScan }) => {
    const scannerRef = useRef<HTMLDivElement>(null);
    const [isScanning, setIsScanning] = useState(false);
    const [manualVIN, setManualVIN] = useState('');

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
                    onScan(vin);
                    setIsScanning(false);
                    Quagga.stop();
                }
            });

            return () => {
                Quagga.stop();
            };
        }
    }, [isScanning, onScan]);

    const handleManualSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validateVIN(manualVIN)) {
            onScan(manualVIN);
        } else {
            toast({
                title: 'Invalid VIN',
                description: 'Please enter a valid 17-character VIN.',
                variant: 'destructive',
            });
        }
    };

    const validateVIN = (vin: string) => {
        return /^[A-HJ-NPR-Z0-9]{17}$/.test(vin);
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