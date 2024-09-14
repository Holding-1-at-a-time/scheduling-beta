// components/vehicle-diagram.tsx
"use client";

import React, { useState } from "react"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { XIcon } from "lucide-react"
import Image from 'next/image';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';

interface Service {
  _id: string;
  name: string;
  price: number;
  description: string;
}

interface VehiclePart {
  _id: string;
  name: string;
  services: string[]; // Array of service IDs
  xPosition: number;
  yPosition: number;
}

export function VehicleDiagram() {
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null);
  const vehicleParts = useQuery(api.vehicleParts.list);
  const services = useQuery(api.services.list);

  const handleHotspotClick = (partId: string) => {
    setActiveHotspot(prev => prev === partId ? null : partId);
  };

  const handleCloseHotspot = () => {
    setActiveHotspot(null);
  };

  if (!vehicleParts || !services) {
    return <div>Loading...</div>;
  }

  return (
    <div className="relative w-full max-w-[800px] mx-auto">
      <div className="relative w-full aspect-[16/9]">
        <Image src="/vehicle-diagram.svg" alt="Vehicle Diagram" fill className="object-contain" />
        {vehicleParts.map((part) => (
          <Popover key={part._id} open={activeHotspot === part._id} onOpenChange={(open) => !open && handleCloseHotspot()}>
            <PopoverTrigger asChild>
              <div
                className="absolute w-10 h-10 rounded-full bg-primary/50 cursor-pointer transition-all hover:scale-110 hover:bg-primary/70"
                style={{ left: `${part.xPosition}%`, top: `${part.yPosition}%` }}
                onClick={() => handleHotspotClick(part._id)}
              >
                <div className="flex items-center justify-center h-full text-white font-bold">{part.name[0]}</div>
              </div>
            </PopoverTrigger>
            <PopoverContent className="w-[300px] p-4 bg-background shadow-lg rounded-md">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold">{part.name}</h3>
                <Button variant="ghost" size="icon" className="hover:bg-muted" onClick={handleCloseHotspot}>
                  <XIcon className="w-5 h-5" />
                </Button>
              </div>
              <div className="grid gap-4">
                {part.services.map((serviceId) => {
                  const service = services.find(s => s._id === serviceId);
                  if (!service) return null;
                  return (
                    <div key={service._id} className="flex justify-between items-center">
                      <div>
                        <div className="font-medium">{service.name}</div>
                        <div className="text-sm text-gray-500">{service.description}</div>
                      </div>
                      <div className="font-bold text-primary">${service.price.toFixed(2)}</div>
                    </div>
                  );
                })}
              </div>
            </PopoverContent>
          </Popover>
        ))}
      </div>
    </div>
  );
}