// components/service-management.tsx
'use client'

<<<<<<< HEAD
import React, { useState } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from '@/components/ui/use-toast';
import { Spinner } from '@/components/ui/spinner';
import { Service } from '@/types/service';

export const ServiceManagement: React.FC = () => {
    const [isAddingService, setIsAddingService] = useState(false);
    const [editingService, setEditingService] = useState<Service | null>(null);
    const [newService, setNewService] = useState<Partial<Service>>({});

    const services = useQuery(api.services.list);
    const addService = useMutation(api.services.add);
    const updateService = useMutation(api.services.update);
    const deleteService = useMutation(api.services.remove);

    const handleAddService = async () => {
        try {
            await addService(newService);
            setIsAddingService(false);
            setNewService({});
            toast({ title: "Success", description: "Service added successfully" });
        } catch (error) {
            console.error("Error adding service:", error);
            toast({ title: "Error", description: "Failed to add service", variant: "destructive" });
        }
    };

    const handleUpdateService = async () => {
        if (!editingService) return;
        try {
            await updateService({ id: editingService._id, ...editingService });
            setEditingService(null);
            toast({ title: "Success", description: "Service updated successfully" });
        } catch (error) {
            console.error("Error updating service:", error);
            toast({ title: "Error", description: "Failed to update service", variant: "destructive" });
        }
    };

    const handleDeleteService = async (id: string) => {
        try {
            await deleteService({ id });
            toast({ title: "Success", description: "Service deleted successfully" });
        } catch (error) {
            console.error("Error deleting service:", error);
            toast({ title: "Error", description: "Failed to delete service", variant: "destructive" });
        }
    };

    if (!services) {
        return <Spinner />;
    }

    return (
        <div className="space-y-4">
            <h1 className="text-2xl font-bold">Service Management</h1>
            <Button onClick={() => setIsAddingService(true)}>Add New Service</Button>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {services.map((service) => (
                    <Card key={service._id}>
                        <CardHeader>
                            <CardTitle>{service.name}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p>Price: ${service.price.toFixed(2)}</p>
                            <p>Duration: {service.duration} minutes</p>
                            <div className="mt-2 space-x-2">
                                <Button variant="outline" size="sm" onClick={() => setEditingService(service)}>Edit</Button>
                                <Button variant="destructive" size="sm" onClick={() => handleDeleteService(service._id)}>Delete</Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
            <Dialog open={isAddingService} onOpenChange={setIsAddingService}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add New Service</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <Input
                            placeholder="Service Name"
                            value={newService.name || ''}
                            onChange={(e) => setNewService({ ...newService, name: e.target.value })}
                        />
                        <Input
                            placeholder="Price"
                            type="number"
                            value={newService.price || ''}
                            onChange={(e) => setNewService({ ...newService, price: parseFloat(e.target.value) })}
                        />
                        <Input
                            placeholder="Duration (minutes)"
                            type="number"
                            value={newService.duration || ''}
                            onChange={(e) => setNewService({ ...newService, duration: parseInt(e.target.value) })}
                        />
                        <Button onClick={handleAddService}>Add Service</Button>
                    </div>
                </DialogContent>
            </Dialog>
            <Dialog open={!!editingService} onOpenChange={() => setEditingService(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Service</DialogTitle>
                    </DialogHeader>
                    {editingService && (
                        <div className="space-y-4">
                            <Input
                                placeholder="Service Name"
                                value={editingService.name}
                                onChange={(e) => setEditingService({ ...editingService, name: e.target.value })}
                            />
                            <Input
                                placeholder="Price"
                                type="number"
                                value={editingService.price}
                                onChange={(e) => setEditingService({ ...editingService, price: parseFloat(e.target.value) })}
                            />
                            <Input
                                placeholder="Duration (minutes)"
                                type="number"
                                value={editingService.duration}
                                onChange={(e) => setEditingService({ ...editingService, duration: parseInt(e.target.value) })}
                            />
                            <Button onClick={handleUpdateService}>Update Service</Button>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
};
=======
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
import { Spinner } from '@/components/ui/spinner'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Trash2, Edit, Plus } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'

const serviceSchema = z.object({
    name: z.string().min(1, 'Service name is required'),
    description: z.string().min(10, 'Description must be at least 10 characters'),
    price: z.number().min(0, 'Price must be a positive number'),
    duration: z.number().min(1, 'Duration must be at least 1 minute'),
})

type ServiceFormData = z.infer<typeof serviceSchema>

interface Service extends ServiceFormData {
    _id: string;
    tenantId: string;
}

export function ServiceManagement() {
    const { toast } = useToast()
    const services = useQuery(api.services.list)
    const addService = useMutation(api.services.add)
    const updateService = useMutation(api.services.update)
    const deleteService = useMutation(api.services.remove)

    const [editingService, setEditingService] = useState<string | null>(null)
    const [isDialogOpen, setIsDialogOpen] = useState(false)

    const form = useForm<ServiceFormData>({
        resolver: zodResolver(serviceSchema),
        defaultValues: {
            name: '',
            description: '',
            price: 0,
            duration: 60,
        },
    })

    const onSubmit = async (data: ServiceFormData) => {
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
            setIsDialogOpen(false)
        } catch (error) {
            console.error('Error saving service:', error)
            toast({
                title: 'Save Failed',
                description: 'There was an error saving your service. Please try again.',
                variant: 'destructive',
            })
        }
    }

    const handleEdit = (service: Service) => {
        form.reset(service)
        setEditingService(service._id)
        setIsDialogOpen(true)
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

    if (services === undefined) {
        return <Spinner className="m-4" />
    }

    return (
        <div className="space-y-8">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Service Management</CardTitle>
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button onClick={() => {
                                form.reset()
                                setEditingService(null)
                            }}>
                                <Plus className="w-4 h-4 mr-2" />
                                Add New Service
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>{editingService ? 'Edit Service' : 'Add New Service'}</DialogTitle>
                            </DialogHeader>
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
                                                    <Input {...field} type="number" step="0.01" onChange={e => field.onChange(parseFloat(e.target.value))} />
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
                                                    <Input {...field} type="number" onChange={e => field.onChange(parseInt(e.target.value))} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <Button type="submit">{editingService ? 'Update Service' : 'Add Service'}</Button>
                                </form>
                            </Form>
                        </DialogContent>
                    </Dialog>
                </CardHeader>
                <CardContent>
                    {services.length === 0 ? (
                        <p>No services added yet. Click the 'Add New Service' button to get started.</p>
                    ) : (
                        <ul className="space-y-4">
                            {services.map((service) => (
                                <li key={service._id} className="flex items-center justify-between p-4 bg-gray-100 rounded-lg">
                                    <div>
                                        <h3 className="font-semibold">{service.name}</h3>
                                        <p className="text-sm text-gray-600">{service.description}</p>
                                        <p className="text-sm">${service.price.toFixed(2)} - {service.duration} minutes</p>
                                    </div>
                                    <div className="flex space-x-2">
                                        <Button variant="outline" size="sm" onClick={() => handleEdit(service)}>
                                            <Edit className="w-4 h-4 mr-2" />
                                            Edit
                                        </Button>
                                        <Button variant="destructive" size="sm" onClick={() => handleDelete(service._id)}>
                                            <Trash2 className="w-4 h-4 mr-2" />
                                            Delete
                                        </Button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
>>>>>>> development
