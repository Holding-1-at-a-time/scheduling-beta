// components/client-management.tsx
'use client'

import React, { useState } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from '@/components/ui/use-toast';
import { Spinner } from '@/components/ui/spinner';
import { Client } from '@/types/client';

export const ClientManagement: React.FC = () => {
    const [page, setPage] = useState(1);
    const [isAddingClient, setIsAddingClient] = useState(false);
    const [newClient, setNewClient] = useState<Partial<Client>>({});

    const clients = useQuery(api.clients.list, { page, pageSize: 10 });
    const addClient = useMutation(api.clients.add);
    const updateClient = useMutation(api.clients.update);
    const deleteClient = useMutation(api.clients.remove);

    const handleAddClient = async () => {
        try {
            await addClient(newClient);
            setIsAddingClient(false);
            setNewClient({});
            toast({ title: "Success", description: "Client added successfully" });
        } catch (error) {
            console.error("Error adding client:", error);
            toast({ title: "Error", description: "Failed to add client", variant: "destructive" });
        }
    };

    const handleUpdateClient = async (id: string, updatedData: Partial<Client>) => {
        try {
            await updateClient({ id, ...updatedData });
            toast({ title: "Success", description: "Client updated successfully" });
        } catch (error) {
            console.error("Error updating client:", error);
            toast({ title: "Error", description: "Failed to update client", variant: "destructive" });
        }
    };

    const handleDeleteClient = async (id: string) => {
        try {
            await deleteClient({ id });
            toast({ title: "Success", description: "Client deleted successfully" });
        } catch (error) {
            console.error("Error deleting client:", error);
            toast({ title: "Error", description: "Failed to delete client", variant: "destructive" });
        }
    };

    if (!clients) {
        return <Spinner />;
    }

    return (
        <div className="space-y-4">
            <h1 className="text-2xl font-bold">Client Management</h1>
            <Button onClick={() => setIsAddingClient(true)}>Add New Client</Button>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {clients.map((Client) => (
                        <TableRow key={client._id}>
                            <TableCell>{client.name}</TableCell>
                            <TableCell>{client.email}</TableCell>
                            <TableCell>{client.phone}</TableCell>
                            <TableCell>
                                <Button variant="outline" size="sm" onClick={() => handleUpdateClient(client._id, { /* Updated data */ })}>Edit</Button>
                                <Button variant="destructive" size="sm" onClick={() => handleDeleteClient(client._id)}>Delete</Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <div className="flex justify-between">
                <Button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>Previous</Button>
                <Button onClick={() => setPage(p => p + 1)} disabled={clients.length < 10}>Next</Button>
            </div>
            <Dialog open={isAddingClient} onOpenChange={setIsAddingClient}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add New Client</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <Input
                            placeholder="Name"
                            value={newClient.name || ''}
                            onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
                        />
                        <Input
                            placeholder="Email"
                            type="email"
                            value={newClient.email || ''}
                            onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
                        />
                        <Input
                            placeholder="Phone"
                            type="tel"
                            value={newClient.phone || ''}
                            onChange={(e) => setNewClient({ ...newClient, phone: e.target.value })}
                        />
                        <Button onClick={handleAddClient}>Add Client</Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};