'use client'

import React, { useState } from 'react'
import { useMutation } from 'convex/react'
import { api } from '../../convex/_generated/api'
import VehicleForm from '@/components/vehicle-form'
import { EstimateCard } from '@/components/Estimate-Card'
import AppointmentForm from '@/components/appointment-form'

interface VehicleInfo {
  make: string
  model: string
  year: number
  condition: string
}

interface Estimate {
  cost: number
  duration: number
}

export default function SelfAssessment() {
  const [step, setStep] = useState<'vehicle-info' | 'display-estimate' | 'schedule-appointment'>('vehicle-info')
  const [vehicleInfo, setVehicleInfo] = useState<VehicleInfo | null>(null)
  const [estimate, setEstimate] = useState<Estimate | null>(null)

  const generateEstimate = useMutation(api.aiEstimate.generate)

  const handleVehicleInfoSubmit = async (info: VehicleInfo) => {
    setVehicleInfo(info)
    try {
      const estimateResult = await generateEstimate(info)
      if (estimateResult) {
        setEstimate(estimateResult)
        setStep('display-estimate')
      } else {
        throw new Error('Failed to generate estimate')
      }
    } catch (error) {
      console.error('Error generating estimate:', error)
      // Handle error state
    }
  }

  const handleScheduleAppointment = () => {
    setStep('schedule-appointment')
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Self Assessment</h1>
      {step === 'vehicle-info' && (
        <VehicleForm onSubmit={handleVehicleInfoSubmit} />
      )}
      {step === 'display-estimate' && estimate && (
        <EstimateCard 
          estimate={estimate} 
          onSchedule={handleScheduleAppointment} 
        />
      )}
      {step === 'schedule-appointment' && vehicleInfo && estimate && (
        <AppointmentForm 
          vehicleInfo={vehicleInfo} 
          estimate={estimate} 
        />
      )}
    </div>
  )
}