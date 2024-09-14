// components/estimate-card.tsx
import React from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Id } from '@/convex/_generated/dataModel'

interface EstimateItem {
  id: string
  name: string
  price: number
}

interface Estimate {
  _id: Id<'estimates'>
  number: string
  status: 'pending' | 'approved' | 'declined'
  items: EstimateItem[]
  total: number
}

interface EstimateCardProps {
  readonly estimate: Estimate
  readonly onApprove: (id: Id<'estimates'>) => Promise<void>
  readonly onDecline: (id: Id<'estimates'>) => Promise<void>
  readonly onConvert: (id: Id<'estimates'>) => Promise<void>
  readonly onRevise: (id: Id<'estimates'>) => Promise<void>
}

export function EstimateCard({
  estimate,
  onApprove,
  onDecline,
  onConvert,
  onRevise
}: EstimateCardProps) {
  const getStatusColor = (status: Estimate['status']): string => {
    switch (status) {
      case 'pending': return 'text-yellow-500'
      case 'approved': return 'text-green-500'
      case 'declined': return 'text-red-500'
    }
  }

  return (
    <Card className="bg-primary text-primary-foreground shadow-lg hover:shadow-2xl transition-shadow duration-300">
      <CardHeader>
        <CardTitle>Estimate #{estimate.number}</CardTitle>
        <CardDescription className={getStatusColor(estimate.status)}>
          {estimate.status.charAt(0).toUpperCase() + estimate.status.slice(1)}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-2">
          {estimate.items.map((item) => (
            <div key={item.id} className="flex items-center justify-between">
              <div>{item.name}</div>
              <div>${item.price.toFixed(2)}</div>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <div className="flex items-center justify-between w-full">
          <div className="font-semibold">Total</div>
          <div className="text-2xl font-bold">${estimate.total.toFixed(2)}</div>
        </div>
        <div className="flex gap-2 mt-4">
          {estimate.status === 'pending' && (
            <>
              <Button size="sm" onClick={() => onApprove(estimate._id)}>Approve</Button>
              <Button size="sm" variant="secondary" onClick={() => onDecline(estimate._id)}>Decline</Button>
            </>
          )}
          {estimate.status === 'approved' && (
            <Button size="sm" onClick={() => onConvert(estimate._id)}>Convert to Invoice</Button>
          )}
          {estimate.status === 'declined' && (
            <Button size="sm" onClick={() => onRevise(estimate._id)}>Revise</Button>
          )}
        </div>
      </CardFooter>
    </Card>
  )
}