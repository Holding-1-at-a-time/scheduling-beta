// components/service-summary.tsx
import React from 'react';
import { Service } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { FileGallery } from '@/components/file-gallery';
import { AIEstimation } from '@/components/ai-estimation';

interface ServiceSummaryProps {
    services: Service[];
}

export const ServiceSummary: React.FC<ServiceSummaryProps> = React.memo(({ services }) => {
    if (!services || services.length === 0) {
        return <p>No services selected.</p>;
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Selected Services</CardTitle>
            </CardHeader>
            <CardContent>
                <Accordion type="single" collapsible className="w-full">
                    {services.map((service, index) => (
                        <AccordionItem key={service.id} value={`item-${index}`}>
                            <AccordionTrigger>
                                {service.name} - ${service.price.toFixed(2)}
                            </AccordionTrigger>
                            <AccordionContent>
                                <ServiceDetails service={service} />
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </CardContent>
        </Card>
    );
});

const ServiceDetails: React.FC<{ service: Service }> = ({ service }) => (
    <div className="space-y-2">
        <p>{service.description}</p>
        {service.notes && <p className="text-sm text-gray-500">{service.notes}</p>}
        {service.estimate && <AIEstimation estimate={service.estimate} />}
        {service.files && service.files.length > 0 && <FileGallery files={service.files} />}
        {service.customizations && service.customizations.length > 0 && (
            <div>
                <strong>Customizations:</strong>
                <div className="flex flex-wrap gap-1 mt-1">
                    {service.customizations.map((customizations: any, index: any) => (
                        <Badge key={index} variant="outline">{customizations}</Badge>
                    ))}
                </div>
            </div>
        )}
        {service.services && service.services.length > 0 && (
            <div>
                <strong>Additional Services:</strong>
                <ServiceSummary services={service.services} />
            </div>
        )}
    </div>
);