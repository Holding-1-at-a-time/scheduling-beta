// components/settings/integrations-config.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { useMutation, useQuery } from 'convex/react';
import { useState } from 'react';
import LoadingSpinner from "../LoadingSpinner";

export interface IntegrationsConfigProps {
  tenantId: Id<"tenants">
}

export const IntegrationsConfig = ({ tenantId }: IntegrationsConfigProps) => {
  const { toast } = useToast()
  const [loadingIntegration, setLoadingIntegration] = useState<null | Id<"integrations">>(null)

  const integrationsQuery = useQuery(api.integrations.list, { tenantId })
  const toggleIntegrationMutation = useMutation(api.integrations.toggle)

  const handleToggleIntegration = async (
    { integrationId, currentStatus }: {
      tenantId: Id<"tenants">
      integrationId: Id<"integrations">
      currentStatus: boolean
    }
  ) => {
    setLoadingIntegration(integrationId)
    try {
      await toggleIntegrationMutation({ integrationId, isConnected: !currentStatus })
      toast({
        title: "Success",
        description: `Integration ${currentStatus ? 'disconnected' : 'connected'} successfully`,
      })
    } catch (error) {
      console.error('Error toggling integration:', error)
      toast({
        title: "Error",
        description: `Failed to ${currentStatus ? 'disconnect' : 'connect'} integration. Please try again.`,
        variant: "destructive",
      })
    } finally {
      setLoadingIntegration(null)
    }
  }

  if (integrationsQuery === undefined) {
    return <div>Loading...</div>
  }

  return (
    <Card className="bg-white/10 backdrop-blur-md shadow-lg shadow-[#00AE98]/30 rounded-2xl overflow-hidden">
      <CardHeader>
        <CardTitle>Integrations</CardTitle>
        <CardDescription>Connect your third-party services</CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <ul className="space-y-4">
          {integrationsQuery.integrations.map((integration) => (
            <li key={integration._id} className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-white">{integration.integrationName}</h3>
                <p className="text-sm text-white/80">{integration.integrationDescription}</p>
              </div>
              <Button
                variant="outline"
                className="text-white hover:bg-white/10 transition-colors"
                onClick={() => handleToggleIntegration({ tenantId, integrationId: integration._id, currentStatus: integration.integrationConfig[0].isConnected })}
                disabled={loadingIntegration === integration._id}
              >
                {loadingIntegration === integration._id ? (
                  <LoadingSpinner className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                {integration.integrationConfig[0].isConnected ? 'Disconnect' : 'Connect'}
              </Button>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}

