// components/invoice-card.tsx
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface InvoiceItem {
  id: string;
  name: string;
  price: number;
}

interface Invoice {
  _id: string;
  number: string;
  status: 'unpaid' | 'paid' | 'overdue';
  items: InvoiceItem[];
  total: number;
  dueDate: string;
}

interface InvoiceCardProps {
  invoice: Invoice;
}

export function InvoiceCard({ invoice }: InvoiceCardProps) {
  const getStatusColor = (status: Invoice['status']) => {
    switch (status) {
      case 'unpaid': return 'text-yellow-500';
      case 'paid': return 'text-green-500';
      case 'overdue': return 'text-red-500';
      default: return '';
    }
  };

  return (
    <Card className="bg-primary text-primary-foreground shadow-lg hover:shadow-2xl transition-shadow duration-300">
      <CardHeader>
        <CardTitle>Invoice #{invoice.number}</CardTitle>
        <CardDescription className={getStatusColor(invoice.status)}>
          {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-2">
          {invoice.items.map((item) => (
            <div key={item.id} className="flex items-center justify-between">
              <div>{item.name}</div>
              <div>${item.price.toFixed(2)}</div>
            </div>
          ))}
        </div>
        <div className="mt-4">
          <div className="font-semibold">Due Date</div>
          <div>{new Date(invoice.dueDate).toLocaleDateString()}</div>
        </div>
      </CardContent>
      <CardFooter>
        <div className="flex items-center justify-between w-full">
          <div className="font-semibold">Total</div>
          <div className="text-2xl font-bold">${invoice.total.toFixed(2)}</div>
        </div>
        <div className="flex gap-2 mt-4">
          {invoice.status === 'unpaid' && (
            <Button size="sm">Pay Now</Button>
          )}
          <Button size="sm" variant="secondary">View Invoice</Button>
        </div>
      </CardFooter>
    </Card>
  );
}