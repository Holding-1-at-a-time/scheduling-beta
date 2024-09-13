// components/vehicle-profiles.tsx
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
import Image from 'next/image';
import { Vehicle } from '@/types/vehicle';

export const VehicleProfiles: React.FC = () => {
    const [isAddingVehicle, setIsAddingVehicle] = useState(false);
    const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
    const [newVehicle, setNewVehicle] = useState<Partial<Vehicle>>({});

    const vehicles = useQuery(api.vehicles.list);
    const addVehicle = useMutation(api.vehicles.add);
    const updateVehicle = useMutation(api.vehicles.update);
    const deleteVehicle = useMutation(api.vehicles.remove);

    const handleAddVehicle = async () => {
        try {
            await addVehicle(newVehicle);
            setIsAddingVehicle(false);
            setNewVehicle({});
            toast({ title: "Success", description: "Vehicle added successfully" });
        } catch (error) {
            console.error("Error adding vehicle:", error);
            toast({ title: "Error", description: "Failed to add vehicle", variant: "destructive" });
        }
    };

    const handleUpdateVehicle = async () => {
        if (!editingVehicle) return;
        try {
            await updateVehicle({ id: editingVehicle._id, ...editingVehicle });
            setEditingVehicle(null);
            toast({ title: "Success", description: "Vehicle updated successfully" });
        } catch (error) {
            console.error("Error updating vehicle:", error);
            toast({ title: "Error", description: "Failed to update vehicle", variant: "destructive" });
        }
    };

    const handleDeleteVehicle = async (id: string) => {
        try {
            await deleteVehicle({ id });
            toast({ title: "Success", description: "Vehicle deleted successfully" });
        } catch (error) {
            console.error("Error deleting vehicle:", error);
            toast({ title: "Error", description: "Failed to delete vehicle", variant: "destructive" });
        }
    };

    if (!vehicles) {
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
                    <div className="space-y-4">
                        <Input
                            placeholder="Make"
                            value={newVehicle.make || ''}
                            onChange={(e) => setNewVehicle({ ...newVehicle, make: e.target.value })}
                        />
                        <Input
                            placeholder="Model"
                            value={newVehicle.model || ''}
                            onChange={(e) => setNewVehicle({ ...newVehicle, model: e.target.value })}
                        />
                        <Input
                            placeholder="Year"
                            type="number"
                            value={newVehicle.year || ''}
                            onChange={(e) => setNewVehicle({ ...newVehicle, year: parseInt(e.target.value) })}
                        />
                        <Input
                            placeholder="Image URL"
                            value={newVehicle.image || ''}
                            onChange={(e) => setNewVehicle({ ...newVehicle, image: e.target.value })}
                        />
                        <Button onClick={handleAddVehicle}>Add Vehicle</Button>
                    </div>
                </DialogContent>
            </Dialog>
            <Dialog open={!!editingVehicle} onOpenChange={() => setEditingVehicle(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Vehicle</DialogTitle>
                    </DialogHeader>
                    {editingVehicle && (
                        <div className="space-y-4">
                            <Input
                                placeholder="Make"
                                value={editingVehicle.make}
                                onChange={(e) => setEditingVehicle({ ...editingVehicle, make: e.target.value })}
                            />
                            <Input
                                placeholder="Model"
                                value={editingVehicle.model}
                                onChange={(e) => setEditingVehicle({ ...editingVehicle, model: e.target.value })}
                            />
                            <Input
                                placeholder="Year"
                                type="number"
                                value={editingVehicle.year}
                                onChange={(e) => setEditingVehicle({ ...editingVehicle, year: parseInt(e.target.value) })}
                            />
                            <Input
                                placeholder="Image URL"
                                value={editingVehicle.image}
                                onChange={(e) => setEditingVehicle({ ...editingVehicle, image: e.target.value })}
                            />
                            <Button onClick={handleUpdateVehicle}>Update Vehicle</Button>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
};