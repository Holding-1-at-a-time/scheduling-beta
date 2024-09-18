'use client'

import { useState } from 'react'
import { useMutation } from 'convex/react'
import { api } from '../../../convex/_generated/api'

export default function AppointmentScheduler({ vehicleInfo, estimate }) {
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')

  const scheduleAppointment = useMutation(api.appointments.schedule)

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await scheduleAppointment({
        vehicleInfo,
        estimatedCost: estimate.cost,
        estimatedDuration: estimate.duration,
        date,
        time,
      })
      // Handle successful scheduling (e.g., show confirmation, redirect)
    } catch (error) {
      console.error('Error scheduling appointment:', error)
      // Handle error state
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        required
        className="w-full p-2 border rounded"
      />
      <input
        type="time"
        value={time}
        onChange={(e) => setTime(e.target.value)}
        required
        className="w-full p-2 border rounded"
      />
      <button type="submit" className="bg-blue-500 text-white p-2 rounded">
        Confirm Appointment
      </button>
    </form>
  )
}