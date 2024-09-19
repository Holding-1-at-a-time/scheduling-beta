// components/settings.tsx
<<<<<<< HEAD
import React, { Suspense } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SettingsIcon } from '@/components/icons';
import { UserRolesManagement } from '@/components/settings/user-roles-management';
import { BusinessDetails } from '@/components/settings/business-details';
import { ServicePackages } from '@/components/settings/service-packages';
import { NotificationPreferences } from '@/components/settings/notification-preferences';
import { IntegrationsConfig } from '@/components/settings/integrations-config';
import { AdvancedSettings } from '@/components/settings/advanced-settings';
import { ErrorBoundary } from '@/components/error-boundary';
import { LoadingSpinner } from '@/components/loading-spinner';
=======
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from '@/convex/_generated/api';
import { useQuery } from 'convex/react';
import { SettingsIcon } from 'lucide-react';
import { useParams } from 'next/navigation';
import { Suspense } from 'react';
import ErrorBoundary from './ErrorBoundary';
import AdvancedSettings from './Advanced-Settings';
import IntegrationsConfig from './Integrations-Config';
import LoadingSpinner from "./LoadingSpinner";
>>>>>>> development

export function Settings() {
  const params = useParams();
  const tenantId = params.tenantsId as string;

<<<<<<< HEAD
=======
  const tenant = useQuery(api.tenants.getTenantById, { tenantId });

>>>>>>> development
  if (!tenantId) {
    return <div>Error: Tenant ID not found</div>;
  }

<<<<<<< HEAD
=======
  if (!tenant) {
    return <LoadingSpinner />;
  }

>>>>>>> development
  return (
    <div className="bg-gradient-to-br from-primary to-primary-light min-h-screen p-8">
      <Card className="max-w-6xl mx-auto bg-white/10 backdrop-blur-md shadow-2xl shadow-primary/50 rounded-2xl overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
<<<<<<< HEAD
            <CardTitle className="text-3xl font-bold text-white">Settings</CardTitle>
=======
            <CardTitle className="text-3xl font-bold text-white">{tenant.name} Settings</CardTitle>
>>>>>>> development
            <CardDescription className="text-lg text-white/80">Customize your account preferences</CardDescription>
          </div>
          <Button variant="ghost" className="text-white hover:bg-white/10 transition-colors">
            <SettingsIcon className="w-6 h-6" />
          </Button>
        </CardHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
          <ErrorBoundary fallback={<div>Error loading User Roles Management</div>}>
            <Suspense fallback={<LoadingSpinner />}>
              <UserRolesManagement tenantId={tenantId} />
            </Suspense>
          </ErrorBoundary>
          <ErrorBoundary fallback={<div>Error loading Business Details</div>}>
            <Suspense fallback={<LoadingSpinner />}>
              <BusinessDetails tenantId={tenantId} />
            </Suspense>
          </ErrorBoundary>
          <ErrorBoundary fallback={<div>Error loading Service Packages</div>}>
            <Suspense fallback={<LoadingSpinner />}>
              <ServicePackages tenantId={tenantId} />
            </Suspense>
          </ErrorBoundary>
          <ErrorBoundary fallback={<div>Error loading Notification Preferences</div>}>
            <Suspense fallback={<LoadingSpinner />}>
              <NotificationPreferences tenantId={tenantId} />
            </Suspense>
          </ErrorBoundary>
          <ErrorBoundary fallback={<div>Error loading Integrations Config</div>}>
            <Suspense fallback={<LoadingSpinner />}>
              <IntegrationsConfig tenantId={tenantId} />
            </Suspense>
          </ErrorBoundary>
          <ErrorBoundary fallback={<div>Error loading Advanced Settings</div>}>
            <Suspense fallback={<LoadingSpinner />}>
              <AdvancedSettings tenantId={tenantId} />
            </Suspense>
          </ErrorBoundary>
        </div>
      </Card>
    </div>
  );
}