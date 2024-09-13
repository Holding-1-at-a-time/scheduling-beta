// components/service-management.tsx
'use client'

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