'use client'

import React, { useState, ChangeEvent, FormEvent } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface VehicleInfo {
  make: string
  model: string
  year: string
  condition: string
}

interface VehicleInfoFormProps {
  onSubmit: (vehicleInfo: VehicleInfo) => void
}

export default function VehicleInfoForm({ onSubmit }: VehicleInfoFormProps) {
  const [vehicleInfo, setVehicleInfo] = useState<VehicleInfo>({
    make: '',
    model: '',
    year: '',
    condition: '',
  })

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setVehicleInfo((prev) => ({ ...prev, [name]: value }))
  }

  const handleConditionChange = (value: string) => {
    setVehicleInfo((prev) => ({ ...prev, condition: value }))
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    onSubmit(vehicleInfo)
  }

  const currentYear = new Date().getFullYear()
  const yearOptions = Array.from({ length: 50 }, (_, i) => currentYear - i)

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="make">Make</Label>
        <Input
          id="make"
          type="text"
          name="make"
          value={vehicleInfo.make}
          onChange={handleChange}
          placeholder="Vehicle Make"
          required
        />
      </div>

      <div>
        <Label htmlFor="model">Model</Label>
        <Input
          id="model"
          type="text"
          name="model"
          value={vehicleInfo.model}
          onChange={handleChange}
          placeholder="Vehicle Model"
          required
        />
      </div>

      <div>
        <Label htmlFor="year">Year</Label>
        <Select name="year" value={vehicleInfo.year} onValueChange={(value) => handleConditionChange(value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select Year" />
          </SelectTrigger>
          <SelectContent>
            {yearOptions.map((year) => (
              <SelectItem key={year} value={year.toString()}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="condition">Condition</Label>
        <Select name="condition" value={vehicleInfo.condition} onValueChange={(value) => handleConditionChange(value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select Condition" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="excellent">Excellent</SelectItem>
            <SelectItem value="good">Good</SelectItem>
            <SelectItem value="fair">Fair</SelectItem>
            <SelectItem value="poor">Poor</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button type="submit">Submit Assessment</Button>
    </form>
  )
}