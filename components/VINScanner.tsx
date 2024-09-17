// components/vin-scanner.tsx
'use client'

<<<<<<< HEAD
import React, { useEffect, useRef, useState } from 'react';
=======
import React, { useEffect, useRef, useState, useCallback } from 'react';
>>>>>>> development
import Quagga from 'quagga';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
<<<<<<< HEAD
=======
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { validateVIN } from '@/convex/vinscanner';
>>>>>>> development

interface VINScannerProps {
    onScan: (vin: string) => void;
}

export const VINScanner: React.FC<VINScannerProps> = ({ onScan }) => {
    const scannerRef = useRef<HTMLDivElement>(null);
    const [isScanning, setIsScanning] = useState(false);
    const [manualVIN, setManualVIN] = useState('');
<<<<<<< HEAD

    useEffect(() => {
        if (isScanning && scannerRef.current) {
=======
    const validateVIN = useMutation(api.vehicles.validateVIN);

    const startScanner = useCallback(() => {
        if (scannerRef.current) {
>>>>>>> development
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
<<<<<<< HEAD
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
=======
            },
                (err: Error) => {
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
                }
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
>>>>>>> development
        } else {
            toast({
                title: 'Invalid VIN',
                description: 'Please enter a valid 17-character VIN.',
                variant: 'destructive',
            });
        }
<<<<<<< HEAD
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
=======
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
>>>>>>> development
};