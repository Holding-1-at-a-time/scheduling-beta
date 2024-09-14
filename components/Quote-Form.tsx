// components/quote-form.tsx
'use client'


import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { processQuote } from '@/lib/api'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import ImageUpload from './ImageUpload'
import QuoteEstimate from './QuoteEstimate'

const formSchema = z.object({
    vehicleType: z.string().min(1, 'Vehicle type is required'),
    condition: z.string().min(1, 'Vehicle condition is required'),
    images: z.array(z.string()).min(1, 'At least one image is required'),
})

export default function QuoteForm() {
    const [isLoading, setIsLoading] = useState(false)
    const [quoteEstimate, setQuoteEstimate] = useState<number | null>(null),
    const router = useRouter()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            vehicleType: '',
            condition: '',
            images: [],
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true)
        try {
            const estimate = await processQuote(values)
            setQuoteEstimate(estimate)
        } catch (error) {
            console.error('Error processing quote:', error)
            // Handle error state here
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                    control={form.control}
                    name="vehicleType"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Vehicle Type</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select vehicle type" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="sedan">Sedan</SelectItem>
                                    <SelectItem value="suv">SUV</SelectItem>
                                    <SelectItem value="truck">Truck</SelectItem>
                                    <SelectItem value="van">Van</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="condition"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Vehicle Condition</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select vehicle condition" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="excellent">Excellent</SelectItem>
                                    <SelectItem value="good">Good</SelectItem>
                                    <SelectItem value="fair">Fair</SelectItem>
                                    <SelectItem value="poor">Poor</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="images"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Vehicle Images</FormLabel>
                            <FormControl>
                                <ImageUpload
                                    value={field.value}
                                    onChange={(URLs) => field.onChange(URLs)}
                                    onRemove={(URL) => field.onChange(field.value.filter((item) => item !== URL))}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" disabled={isLoading}>
                    {isLoading ? 'Processing...' : 'Get Quote'}
                </Button>
            </form>
            {quoteEstimate !== null && <QuoteEstimate estimate={quoteEstimate} />}
        </Form>
    )
}