// components/settings/integrations-config.tsx
"use client";

import React, { useState } from 'react';
import { useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { Loader2 } from 'lucide-react';

interface Integration {
  id: string;
  name: string;
  description: string;
  isConnected: boolean;
}

interface IntegrationsConfigProps {
  tenantId: Id<"tenants">;
}

export default function IntegrationsConfig({ tenantId }: IntegrationsConfigProps) {
  const { toast } = useToast();
  const [loadingIntegration, setLoadingIntegration] = useState<string | null>(null);

  const integrations = useQuery(api.integrations.list, { tenantId });
  const toggleIntegration = useMutation(api.integrations.toggle);

  const handleToggleIntegration = async (integrationId: string, currentStatus: boolean) => {
    setLoadingIntegration(integrationId);
    try {
      await toggleIntegration({ tenantId, integrationId, isConnected: !currentStatus });
      toast({
        title: "Success",
        description: `Integration ${currentStatus ? 'disconnected' : 'connected'} successfully`,
      });
    } catch (error) {
      console.error('Error toggling integration:', error);
      toast({
        title: "Error",
        description: `Failed to ${currentStatus ? 'disconnect' : 'connect'} integration. Please try again.`,
        variant: "destructive",
      });
    } finally {
      setLoadingIntegration(null);
    }
  };

  if (integrations === undefined) {
    return <div>Loading...</div>;
  }

  return (
    <Card className="bg-white/10 backdrop-blur-md shadow-lg shadow-[#00AE98]/30 rounded-2xl overflow-hidden">
      <CardHeader>
        <CardTitle>Integrations</CardTitle>
        <CardDescription>Connect your third-party services</CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          {integrations.map((integration: Integration) => (
            <div key={integration.id} className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-white">{integration.name}</h3>
                <p className="text-sm text-white/80">{integration.description}</p>
              </div>
              <Button
                variant="outline"
                className="text-white hover:bg-white/10 transition-colors"
                onClick={() => handleToggleIntegration(integration.id, integration.isConnected)}
                disabled={loadingIntegration === integration.id}
              >
                {loadingIntegration === integration.id ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                {integration.isConnected ? 'Disconnect' : 'Connect'}
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}