// components/service-form.tsx
'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useMutation, useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { useToast } from '@/components/ui/use-toast'

const serviceSchema = z.object({
    name: z.string().min(1, 'Service name is required'),
    description: z.string().min(10, 'Description must be at least 10 characters'),
    price: z.number().min(0, 'Price must be a positive number'),
    duration: z.number().min(1, 'Duration must be at least 1 minute'),
})

export default function ServiceForm() {
    const { toast } = useToast()
    const services = useQuery(api.services.list)
    const addService = useMutation(api.services.add)
    const updateService = useMutation(api.services.update)
    const deleteService = useMutation(api.services.remove)

    const [editingService, setEditingService] = useState<string | null>(null)

    const form = useForm<z.infer<typeof serviceSchema>>({
        resolver: zodResolver(serviceSchema),
        defaultValues: {
            name: '',
            description: '',
            price: 0,
            duration: 60,
        },
    })

    const onSubmit = async (data: z.infer<typeof serviceSchema>) => {
        try {
            if (editingService) {
                await updateService({ id: editingService, ...data })
                toast({
                    title: 'Service Updated',
                    description: 'Your service has been successfully updated.',
                })
            } else {
                await addService(data)
                toast({
                    title: 'Service Added',
                    description: 'Your new service has been successfully added.',
                })
            }
            form.reset()
            setEditingService(null)
        } catch (error) {
            console.error('Error saving service:', error)
            toast({
                title: 'Save Failed',
                description: 'There was an error saving your service. Please try again.',
                variant: 'destructive',
            })
        }
    }

    const handleEdit = (service: any) => {
        form.reset(service)
        setEditingService(service.id)
    }

    const handleDelete = async (id: string) => {
        try {
            await deleteService({ id })
            toast({
                title: 'Service Deleted',
                description: 'The service has been successfully deleted.',
            })
        } catch (error) {
            console.error('Error deleting service:', error)
            toast({
                title: 'Delete Failed',
                description: 'There was an error deleting the service. Please try again.',
                variant: 'destructive',
            })
        }
    }

    if (!services) {
        return <div>Loading...</div>
    }

    return (
        <div className="space-y-8">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Service Name</FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Description</FormLabel>
                                <FormControl>
                                    <Textarea {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="price"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Price ($)</FormLabel>
                                <FormControl>
                                    <Input {...field} type="number" step="0.01" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="duration"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Duration (minutes)</FormLabel>
                                <FormControl>
                                    <Input {...field} type="number" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit">{editingService ? 'Update Service' : 'Add Service'}</Button>
                </form>
            </Form>

            <div className="mt-8">
                <h2 className="text-2xl font-bold mb-4">Your Services</h2>
                <ul className="space-y-4">
                    {services.map((service) => (
                        <li key={service.id} className="flex items-center justify-between p-4 bg-white shadow rounded-lg">
                            <div>
                                <h3 className="font-semibold">{service.name}</h3>
                                <p className="text-sm text-gray-600">{service.description}</p>
                                <p className="text-sm">${service.price.toFixed(2)} - {service.duration} minutes</p>
                            </div>
                            <div>
                                <Button variant="outline" className="mr-2" onClick={() => handleEdit(service)}>Edit</Button>
                                <Button variant="destructive" onClick={() => handleDelete(service.id)}>Delete</Button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}