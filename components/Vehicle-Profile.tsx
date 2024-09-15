// components/vehicle-profile.tsx
'use client'

import React, { useState, useCallback } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { toast } from '@/components/ui/use-toast';
import { Spinner } from '@/components/ui/spinner';
import Image from 'next/image';
import { Id } from '@/convex/_generated/dataModel';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';

const vehicleSchema = z.object({
    make: z.string().min(1, "Make is required"),
    model: z.string().min(1, "Model is required"),
    year: z.number().int().min(1900).max(new Date().getFullYear() + 1),
    image: z.string().url("Invalid image URL"),
});

type VehicleFormData = z.infer<typeof vehicleSchema>;

interface Vehicle extends VehicleFormData {
    _id: Id<"vehicles">;
}

export const VehicleProfiles: React.FC = () => {
    const [isAddingVehicle, setIsAddingVehicle] = useState(false);
    const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);

    const vehicles = useQuery(api.vehicles.list);
    const addVehicle = useMutation(api.vehicles.add);
    const updateVehicle = useMutation(api.vehicles.update);
    const deleteVehicle = useMutation(api.vehicles.remove);

    const form = useForm<VehicleFormData>({
        resolver: zodResolver(vehicleSchema),
        defaultValues: {
            make: '',
            model: '',
            year: new Date().getFullYear(),
            image: '',
        },
    });

    const handleAddVehicle = useCallback(async (data: VehicleFormData) => {
        try {
            await addVehicle(data);
            setIsAddingVehicle(false);
            form.reset();
            toast({ title: "Success", description: "Vehicle added successfully" });
        } catch (error) {
            console.error("Error adding vehicle:", error);
            toast({ title: "Error", description: "Failed to add vehicle", variant: "destructive" });
        }
    }, [addVehicle, form]);

    const handleUpdateVehicle = useCallback(async (data: VehicleFormData) => {
        if (!editingVehicle) {
            return;
        }
        try {
            await updateVehicle({ id: editingVehicle._id, ...data });
            setEditingVehicle(null);
            toast({ title: "Success", description: "Vehicle updated successfully" });
        } catch (error) {
            console.error("Error updating vehicle:", error);
            toast({ title: "Error", description: "Failed to update vehicle", variant: "destructive" });
        }
    }, [editingVehicle, updateVehicle]);

    const handleDeleteVehicle = useCallback(async (id: Id<"vehicles">) => {
        try {
            await deleteVehicle({ id });
            toast({ title: "Success", description: "Vehicle deleted successfully" });
        } catch (error) {
            console.error("Error deleting vehicle:", error);
            toast({ title: "Error", description: "Failed to delete vehicle", variant: "destructive" });
        }
    }, [deleteVehicle]);

    if (vehicles === undefined) {
        return <Spinner />;
    }

    return (
        <div className="space-y-4">
            <h1 className="text-2xl font-bold">Vehicle Profiles</h1>
            <Button onClick={() => setIsAddingVehicle(true)}>Add New Vehicle</Button>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {vehicles.map((vehicle) => (
                    <Card key={vehicle._id}>
                        <CardHeader>
                            <CardTitle>{vehicle.make} {vehicle.model}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Image src={vehicle.image} alt={`${vehicle.make} ${vehicle.model}`} width={200} height={150} className="mb-2 rounded" />
                            <p>Year: {vehicle.year}</p>
                            <div className="mt-2 space-x-2">
                                <Button variant="outline" size="sm" onClick={() => setEditingVehicle(vehicle)}>Edit</Button>
                                <Button variant="destructive" size="sm" onClick={() => handleDeleteVehicle(vehicle._id)}>Delete</Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
            <Dialog open={isAddingVehicle} onOpenChange={setIsAddingVehicle}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add New Vehicle</DialogTitle>
                    </DialogHeader>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(handleAddVehicle)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="make"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Make</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="model"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Model</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="year"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Year</FormLabel>
                                        <FormControl>
                                            <Input {...field} type="number" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="image"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Image URL</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <DialogFooter>
                                <Button type="submit">Add Vehicle</Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>
            <Dialog open={!!editingVehicle} onOpenChange={() => setEditingVehicle(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Vehicle</DialogTitle>
                    </DialogHeader>
                    {editingVehicle && (
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(handleUpdateVehicle)} className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="make"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Make</FormLabel>
                                            <FormControl>
                                                <Input {...field} defaultValue={editingVehicle.make} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="model"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Model</FormLabel>
                                            <FormControl>
                                                <Input {...field} defaultValue={editingVehicle.model} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="year"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Year</FormLabel>
                                            <FormControl>
                                                <Input {...field} type="number" defaultValue={editingVehicle.year} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="image"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Image URL</FormLabel>
                                            <FormControl>
                                                <Input {...field} defaultValue={editingVehicle.image} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <DialogFooter>
                                    <Button type="submit">Update Vehicle</Button>
                                </DialogFooter>
                            </form>
                        </Form>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
};
