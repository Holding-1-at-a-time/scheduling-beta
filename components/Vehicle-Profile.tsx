'use client'

import React, { useState, useCallback } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { toast } from '@/components/ui/use-toast';
import Image from 'next/image';
import { Id } from '@/convex/_generated/dataModel';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Spinner } from '@/components/ui/spinner';
import { getCurrentUserContext } from '@/lib/user-context';
import { generateUniqueId } from '@/lib/utils';

const vehicleSchema = z.object({
    make: z.string().min(1, "Make is required"),
    model: z.string().min(1, "Model is required"),
    year: z.number().int().min(1900).max(new Date().getFullYear() + 1),
    image: z.string().url("Invalid image URL"),
    type: z.string().optional(),
    VIN: z.string().optional(),
});

type VehicleFormData = z.infer<typeof vehicleSchema>;

export const VehicleProfiles: React.FC = () => {
    const [isAddingVehicle, setIsAddingVehicle] = useState(false);
    const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);

    const vehiclesQuery = useQuery(api.vehicles.list);
    const addVehicleMutation = useMutation(api.vehicles.add);
    const updateVehicleMutation = useMutation(api.vehicles.update);
    const deleteVehicleMutation = useMutation(api.vehicles.remove);

    const form = useForm<VehicleFormData>({
        resolver: zodResolver(vehicleSchema),
        defaultValues: {
            make: '',
            model: '',
            year: new Date().getFullYear(),
            image: '',
            type: '',
            VIN: '',
        },
    });

    const handleAddVehicle = useCallback(async (data: VehicleFormData) => {
        try {
            const { tenantId, clientId } = await getCurrentUserContext();
            const vehicleId = generateUniqueId();
            
            await addVehicleMutation({
                ...data,
                type: data.type || 'default',
                tenantId,
                vehicleId,
                clientId,
                VIN: data.VIN || '',
            });
            
            setIsAddingVehicle(false);
            form.reset();
            toast({
                title: "Success",
                description: "Vehicle added successfully",
                variant: "default",
            });
        } catch (error) {
            console.error("Error adding vehicle:", error);
            toast({
                title: "Error",
                description: "Failed to add vehicle. Please try again.",
                variant: "destructive"
            });
        }
    }, [addVehicleMutation, form]);

    const handleUpdateVehicle = useCallback(
        async (data: VehicleFormData) => {
            if (!editingVehicle) return;
            try {
                await updateVehicleMutation({ id: editingVehicle._id, ...data });
                setEditingVehicle(null);
                toast({ title: "Success", description: "Vehicle updated successfully" });
            } catch (error) {
                console.error("Error updating vehicle:", error);
'use client'

import React, { useState, useCallback } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from '@/components/ui/use-toast';
import { Spinner } from '@/components/SpinnerComponent';
import Image from 'next/image';
import { Vehicle } from '@/types/vehicle';
import { Id } from '@/convex/types';
import { useForm, SubmitHandler } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from './ui/form';

interface VehicleFormInputs {
  make: string;
  model: string;
  year: number;
  image: string;
}

export const VehicleProfiles: React.FC = () => {
  const [isAddingVehicle, setIsAddingVehicle] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [newVehicle, setNewVehicle] = useState<Partial<Vehicle>>({});

  const vehiclesQuery = useQuery(api.vehicles.list);
  const addVehicleMutation = useMutation(api.vehicles.add);
  const updateVehicleMutation = useMutation(api.vehicles.update);
  const deleteVehicleMutation = useMutation(api.vehicles.remove);

  const {
    register: addRegister,
    handleSubmit: handleAddSubmit,
    reset: resetAddForm,
    formState: { errors: addErrors },
  } = useForm<VehicleFormInputs>();

  const {
    register: editRegister,
    handleSubmit: handleEditSubmit,
    reset: resetEditForm,
    formState: { errors: editErrors },
  } = useForm<VehicleFormInputs>();

  const handleAddVehicle: SubmitHandler<VehicleFormInputs> = async (data) => {
    try {
      await addVehicleMutation(data);
      setIsAddingVehicle(false);
      resetAddForm();
      toast({ title: "Success", description: "Vehicle added successfully" });
    } catch (error) {
      console.error("Error adding vehicle:", error);
      toast({ title: "Error", description: "Failed to add vehicle", variant: "destructive" });
    }
  };

  const handleUpdateVehicle: SubmitHandler<VehicleFormInputs> = useCallback(
    async (data) => {
      if (!editingVehicle) return;
      try {
        await updateVehicleMutation({ id: editingVehicle._id, ...data });
        setEditingVehicle(null);
        toast({ title: "Success", description: "Vehicle updated successfully" });
      } catch (error) {
        console.error("Error updating vehicle:", error);
        toast({ title: "Error", description: "Failed to update vehicle", variant: "destructive" });
      }
    },
    [editingVehicle, updateVehicleMutation]
  );

  const handleDeleteVehicle = useCallback(
    async (id: Id<"vehicles">) => {
      try {
        await deleteVehicleMutation({ id });
        toast({ title: "Success", description: "Vehicle deleted successfully" });
      } catch (error) {
        console.error("Error deleting vehicle:", error);
        toast({ title: "Error", description: "Failed to delete vehicle", variant: "destructive" });
      }
    },
    [deleteVehicleMutation]
  );

  if (vehiclesQuery.status === 'loading') {
    return <Spinner />;
  }

  if (vehiclesQuery.status === 'error') {
    return <div className="text-red-500">Failed to load vehicles.</div>;
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Vehicle Profiles</h1>
      <Button onClick={() => setIsAddingVehicle(true)}>Add New Vehicle</Button>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {vehiclesQuery.data.vehicles.map((vehicle) => (
          <Card key={vehicle._id}>
            <CardHeader>
              <CardTitle>{`${vehicle.make} ${vehicle.model}`}</CardTitle>
            </CardHeader>
            <CardContent>
              <Image
                src={vehicle.image}
                alt={`${vehicle.make} ${vehicle.model}`}
                width={200}
                height={150}
                className="mb-2 rounded"
              />
              <p>Year: {vehicle.year}</p>
              <div className="mt-2 space-x-2">
                <Button variant="outline" size="sm" onClick={() => setEditingVehicle(vehicle)}>
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDeleteVehicle(vehicle._id)}
                >
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add Vehicle Dialog */}
      <Dialog open={isAddingVehicle} onOpenChange={setIsAddingVehicle}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Vehicle</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddSubmit(handleAddVehicle)} className="space-y-4">
            <FormField>
              <FormItem>
                <FormLabel htmlFor="make">Make</FormLabel>
                <FormControl>
                  <Input
                    id="make"
                    {...addRegister('make', { required: 'Make is required' })}
                  />
                </FormControl>
                <FormMessage>{addErrors.make?.message}</FormMessage>
              </FormItem>
            </FormField>

            <FormField>
              <FormItem>
                <FormLabel htmlFor="model">Model</FormLabel>
                <FormControl>
                  <Input
                    id="model"
                    {...addRegister('model', { required: 'Model is required' })}
                  />
                </FormControl>
                <FormMessage>{addErrors.model?.message}</FormMessage>
              </FormItem>
            </FormField>

            <FormField>
              <FormItem>
                <FormLabel htmlFor="year">Year</FormLabel>
                <FormControl>
                  <Input
                    id="year"
                    type="number"
                    {...addRegister('year', {
                      required: 'Year is required',
                      valueAsNumber: true,
                      min: { value: 1886, message: 'Enter a valid year' },
                    })}
                  />
                </FormControl>
                <FormMessage>{addErrors.year?.message}</FormMessage>
              </FormItem>
            </FormField>

            <FormField>
              <FormItem>
                <FormLabel htmlFor="image">Image URL</FormLabel>
                <FormControl>
                  <Input
                    id="image"
                    {...addRegister('image', { required: 'Image URL is required' })}
                  />
                </FormControl>
                <FormMessage>{addErrors.image?.message}</FormMessage>
              </FormItem>
            </FormField>

            <DialogFooter>
              <Button type="submit">Add Vehicle</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Vehicle Dialog */}
      <Dialog open={!!editingVehicle} onOpenChange={() => setEditingVehicle(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Vehicle</DialogTitle>
          </DialogHeader>
          {editingVehicle && (
            <form onSubmit={handleEditSubmit(handleUpdateVehicle)} className="space-y-4">
              <FormField>
                <FormItem>
                  <FormLabel htmlFor="edit-make">Make</FormLabel>
                  <FormControl>
                    <Input
                      id="edit-make"
                      defaultValue={editingVehicle.make}
                      {...editRegister('make', { required: 'Make is required' })}
                    />
                  </FormControl>
                  <FormMessage>{editErrors.make?.message}</FormMessage>
                </FormItem>
              </FormField>

              <FormField>
                <FormItem>
                  <FormLabel htmlFor="edit-model">Model</FormLabel>
                  <FormControl>
                    <Input
                      id="edit-model"
                      defaultValue={editingVehicle.model}
                      {...editRegister('model', { required: 'Model is required' })}
                    />
                  </FormControl>
                  <FormMessage>{editErrors.model?.message}</FormMessage>
                </FormItem>
              </FormField>

              <FormField>
                <FormItem>
                  <FormLabel htmlFor="edit-year">Year</FormLabel>
                  <FormControl>
                    <Input
                      id="edit-year"
                      type="number"
                      defaultValue={editingVehicle.year}
                      {...editRegister('year', {
                        required: 'Year is required',
                        valueAsNumber: true,
                        min: { value: 1886, message: 'Enter a valid year' },
                      })}
                    />
                  </FormControl>
                  <FormMessage>{editErrors.year?.message}</FormMessage>
                </FormItem>
              </FormField>

              <FormField>
                <FormItem>
                  <FormLabel htmlFor="edit-image">Image URL</FormLabel>
                  <FormControl>
                    <Input
                      id="edit-image"
                      defaultValue={editingVehicle.image}
                      {...editRegister('image', { required: 'Image URL is required' })}
                    />
                  </FormControl>
                  <FormMessage>{editErrors.image?.message}</FormMessage>
                </FormItem>
              </FormField>

              <DialogFooter>
                <Button type="submit">Update Vehicle</Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
