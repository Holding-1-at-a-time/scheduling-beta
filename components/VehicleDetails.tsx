// components/vehicle-details.tsx
import React from 'react';
import Image from 'next/image';
import { VehicleDetails as VehicleDetailsType } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Carousel } from '@/components/ui/carousel';

interface VehicleDetailsProps {
    vehicleDetails: VehicleDetailsType;
}

export const VehicleDetails: React.FC<VehicleDetailsProps> = ({ vehicleDetails }) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>{vehicleDetails.year} {vehicleDetails.make} {vehicleDetails.model}</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <h3 className="text-lg font-semibold mb-2">Basic Information</h3>
                        <p><strong>VIN:</strong> {vehicleDetails.vin}</p>
                        <p><strong>Color:</strong> {vehicleDetails.color}</p>
                        <p><strong>Body Type:</strong> {vehicleDetails.bodyType}</p>
                        <p><strong>Mileage:</strong> {vehicleDetails.mileage}</p>
                        <p><strong>Transmission:</strong> {vehicleDetails.transmission}</p>
                        <p><strong>Engine:</strong> {vehicleDetails.engine}</p>
                        <p><strong>Drivetrain:</strong> {vehicleDetails.drivetrain}</p>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold mb-2">Features</h3>
                        <p><strong>Interior:</strong> {vehicleDetails.interior}</p>
                        <p><strong>Exterior:</strong> {vehicleDetails.exterior}</p>
                        <p><strong>Condition:</strong> {vehicleDetails.condition}</p>
                        <p><strong>Price:</strong> ${vehicleDetails.price.toFixed(2)}</p>
                        <div className="mt-2">
                            <strong>Accessories:</strong>
                            {vehicleDetails.accessories.map((accessory, index) => (
                                <Badge key={index} variant="secondary" className="mr-1 mb-1">{accessory}</Badge>
                            ))}
                        </div>
                        <div className="mt-2">
                            <strong>Options:</strong>
                            {vehicleDetails.options.map((option, index) => (
                                <Badge key={index} variant="secondary" className="mr-1 mb-1">{option}</Badge>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="mt-4">
                    <h3 className="text-lg font-semibold mb-2">Description</h3>
                    <p>{vehicleDetails.description}</p>
                </div>
                <div className="mt-4">
                    <h3 className="text-lg font-semibold mb-2">Images</h3>
                    <Carousel>
                        {vehicleDetails.images.map((image, index) => (
                            <Image key={index} src={image} alt={`Vehicle image ${index + 1}`} width={400} height={300} />
                        ))}
                    </Carousel>
                </div>
                {vehicleDetails.video && (
                    <div className="mt-4">
                        <h3 className="text-lg font-semibold mb-2">Video</h3>
                        <video src={vehicleDetails.video} controls width="100%" />
                    </div>
                )}
                <div className="mt-4">
                    <h3 className="text-lg font-semibold mb-2">Additional Information</h3>
                    <p><strong>Location:</strong> {vehicleDetails.location}</p>
                    <p><strong>Status:</strong> {vehicleDetails.status}</p>
                    <p><strong>Created At:</strong> {new Date(vehicleDetails.createdAt).toLocaleString()}</p>
                    <p><strong>Updated At:</strong> {new Date(vehicleDetails.updatedAt).toLocaleString()}</p>
                </div>
            </CardContent>
        </Card>
    );
};