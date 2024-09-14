// components/vehicle-diagram.tsx
"use client";

import React, { useState } from "react"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { XIcon } from "lucide-react"
import Image from 'next/image';

interface Service {
  name: string;
  price: number;
}

interface VehiclePart {
  name: string;
  services: Service[];
}

const vehicleParts: VehiclePart[] = [
  {
    name: "Exterior",
    services: [
      { name: "Wash & Wax", price: 49.99 },
      { name: "Paint Correction", price: 199.99 },
      { name: "Headlight Restoration", price: 79.99 },
    ],
  },
  {
    name: "Interior",
    services: [
      { name: "Vacuum & Shampoo", price: 59.99 },
      { name: "Leather Conditioning", price: 89.99 },
      { name: "Odor Elimination", price: 39.99 },
    ],
  },
  {
    name: "Wheels & Tires",
    services: [
      { name: "Wheel Cleaning", price: 29.99 },
      { name: "Tire Dressing", price: 19.99 },
      { name: "Brake Cleaning", price: 39.99 },
    ],
  },
  {
    name: "Engine Bay",
    services: [
      { name: "Engine Degreasing", price: 79.99 },
      { name: "Engine Detailing", price: 99.99 },
      { name: "Engine Steam Cleaning", price: 149.99 },
    ],
  },
]

export function VehicleDiagram() {
  const [activeHotspot, setActiveHotspot] = useState<VehiclePart | null>(null)

  const handleHotspotClick = (part: VehiclePart) => {
    setActiveHotspot(prev => prev?.name === part.name ? null : part)
  }

  const handleCloseHotspot = () => {
    setActiveHotspot(null)
  }

  return (
    <div className="relative w-full max-w-[800px] mx-auto">
      <div className="relative w-full aspect-[16/9]">
        <Image src="/placeholder.svg" alt="Vehicle Diagram" fill className="object-contain" />
        {vehicleParts.map((part, index) => (
          <div
            key={index}
            className="absolute w-10 h-10 rounded-full bg-primary/50 cursor-pointer transition-all hover:scale-110 hover:bg-primary/70"
            style={{ left: `${Math.random() * 80}%`, top: `${Math.random() * 80}%` }}
            onClick={() => handleHotspotClick(part)}
          >
            <div className="flex items-center justify-center h-full text-white font-bold">{part.name[0]}</div>
          </div>
        ))}
      </div>
      {activeHotspot && (
        <Popover open onOpenChange={handleCloseHotspot}>
          <PopoverTrigger asChild>
            <div className="absolute w-10 h-10 rounded-full bg-primary/50 cursor-pointer transition-all hover:scale-110 hover:bg-primary/70">
              <div className="flex items-center justify-center h-full text-white font-bold">
                {activeHotspot.name[0]}
              </div>
            </div>
          </PopoverTrigger>
          <PopoverContent className="w-[300px] p-4 bg-background shadow-lg rounded-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">{activeHotspot.name}</h3>
              <Button variant="ghost" size="icon" className="hover:bg-muted" onClick={handleCloseHotspot}>
                <XIcon className="w-5 h-5" />
              </Button>
            </div>
            <div className="grid gap-4">
              {activeHotspot.services.map((service, index) => (
                <div key={index} className="flex justify-between items-center">
                  <div className="font-medium">{service.name}</div>
                  <div className="font-bold text-primary">${service.price.toFixed(2)}</div>
                </div>
              ))}
            </div>
          </PopoverContent>
        </Popover>
      )}
    </div>
  )
}