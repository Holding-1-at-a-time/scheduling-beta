// components/quote-form.tsx
'use client'

<<<<<<< HEAD

=======
>>>>>>> development
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import ImageUpload from './ImageUpload'
import QuoteEstimate from './QuoteEstimate'
<<<<<<< HEAD
=======
import { useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { useUser } from '@clerk/nextjs'
import { toast } from '@/components/ui/use-toast'
import { Spinner } from '@/components/ui/spinner'
>>>>>>> development

const formSchema = z.object({
    vehicleType: z.enum(['sedan', 'suv', 'truck', 'van']),
    condition: z.enum(['excellent', 'good', 'fair', 'poor']),
    images: z.array(z.string().url()).min(1, 'At least one image is required'),
})

type FormData = z.infer<typeof formSchema>

export default function QuoteForm() {
    const [isLoading, setIsLoading] = useState(false)
<<<<<<< HEAD
    const [quoteEstimate, setQuoteEstimate] = useState<number | null>(null),
=======
    const [quoteEstimate, setQuoteEstimate] = useState<{ amount: number; confidence: 'low' | 'medium' | 'high'; quoteId: string } | null>(null)
>>>>>>> development
    const router = useRouter()
    const { user } = useUser()
    const processQuote = useMutation(api.quotes.processQuote)

    const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            vehicleType: 'sedan',
            condition: 'good',
            images: [],
        },
    })

    async function onSubmit(values: FormData) {
        if (!user) {
            toast({
                title: "Authentication required",
                description: "Please sign in to get a quote.",
                variant: "destructive",
            })
            return
        }

        setIsLoading(true)
        try {
            const result = await processQuote({ ...values, tenantId: user.id })
            setQuoteEstimate(result)
            toast({
                title: "Quote processed",
                description: "Your quote estimate is ready.",
            })
        } catch (error) {
            console.error('Error processing quote:', error)
            toast({
                title: "Error",
                description: "Failed to process quote. Please try again.",
                variant: "destructive",
            })
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
                                    onChange={(URLs) => field.onChange(URLs)}
                                    onRemove={(URL) => field.onChange(field.value.filter((item) => item !== URL))}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" disabled={isLoading}>
                    {isLoading ? <Spinner className="mr-2" /> : null}
                    {isLoading ? 'Processing...' : 'Get Quote'}
                </Button>
            </form>
            {quoteEstimate && <QuoteEstimate estimate={quoteEstimate.amount} confidence={quoteEstimate.confidence} quoteId={quoteEstimate.quoteId} />}
        </Form>
    )
} F