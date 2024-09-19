// components/settings/advanced-settings.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { exportData } from "@/convex/advancedSettings";
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useAction } from 'convex/react';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

const advancedSettingsSchema = z.object({
  dataRetention: z.enum(['6months', '1year', '2years', 'indefinite']),
  defaultTimezone: z.string(),
  defaultLanguage: z.enum(['en', 'es', 'fr', 'de']),
});

type AdvancedSettingsForm = z.infer<typeof advancedSettingsSchema>;

interface AdvancedSettingsProps {
  readonly tenantId: Id<"tenants">;
}

export default function AdvancedSettings({ tenantId }: AdvancedSettingsProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const advancedSettings = useQuery<AdvancedSettingsForm>(api.advancedSettings.get, { tenantId });
  const updateAdvancedSettings = useMutation(api.advancedSettings.update);
  const exportData = useAction(api.advancedSettings.exportData);

  const {
    control,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<AdvancedSettingsForm>({
    resolver: zodResolver(advancedSettingsSchema),
    defaultValues: advancedSettings ?? {
      dataRetention: '1year',
      defaultTimezone: 'UTC',
      defaultLanguage: 'en',
    },
  });

  const onSubmit = async (data: AdvancedSettingsForm) => {
    setIsSubmitting(true);
    try {
      await updateAdvancedSettings({
        tenantId,
        settings: data,
      });
      toast({
        title: "Success",
        description: "Advanced settings updated successfully",
      });
    } catch (error) {
      console.error('Error updating advanced settings:', error);
      toast({
        title: "Error",
        description: "Failed to update advanced settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }
};

const handleExportData = async () => {
  setIsExporting(true);
  try {
    const result = await exportData({ tenantId });
    if (result) {
      const blob = new Blob([result], { type: 'application/octet-stream' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `data-export-${tenantId}.zip`;
      link.click();
      URL.revokeObjectURL(url);
      toast({
        title: "Success",
        description: "Data exported successfully. Download should begin shortly.",
      });
    } else {
      throw new Error("Export failed");
    }
  } catch (error) {
    console.error('Error exporting data:', error);
    toast({
      title: "Error",
      description: "Failed to export data. Please try again.",
      variant: "destructive",
    });
  } finally {
    setIsExporting(false);
  }
};

if (advancedSettings === undefined) {
  return <div>Loading...</div>;
}

return (
  <Card className="bg-white/10 backdrop-blur-md shadow-lg shadow-[#00AE98]/30 rounded-2xl overflow-hidden">
    <CardHeader>
      <CardTitle>Advanced Settings</CardTitle>
      <CardDescription>Configure advanced options</CardDescription>
    </CardHeader>
    <CardContent className="p-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label htmlFor="data-retention" className="text-white">Data Retention Period</Label>
          <Controller
            name="dataRetention"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger id="data-retention" className="bg-white/20 text-white">
                  <SelectValue placeholder="Select period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="6months">6 Months</SelectItem>
                  <SelectItem value="1year">1 Year</SelectItem>
                  <SelectItem value="2years">2 Years</SelectItem>
                  <SelectItem value="indefinite">Indefinite</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          {errors.dataRetention && <p className="text-red-500 text-sm mt-1">{errors.dataRetention.message}</p>}
        </div>
        <div>
          <Label htmlFor="default-timezone" className="text-white">Default Timezone</Label>
          <Controller
            name="defaultTimezone"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger id="default-timezone" className="bg-white/20 text-white">
                  <SelectValue placeholder="Select timezone" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="UTC">UTC</SelectItem>
                  <SelectItem value="America/New_York">Eastern Time</SelectItem>
                  <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                  <SelectItem value="Europe/London">GMT</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          {errors.defaultTimezone && <p className="text-red-500 text-sm mt-1">{errors.defaultTimezone.message}</p>}
        </div>
        <div>
          <Label htmlFor="default-language" className="text-white">Default Language</Label>
          <Controller
            name="defaultLanguage"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger id="default-language" className="bg-white/20 text-white">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Spanish</SelectItem>
                  <SelectItem value="fr">French</SelectItem>
                  <SelectItem value="de">German</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          {errors.defaultLanguage && <p className="text-red-500 text-sm mt-1">{errors.defaultLanguage.message}</p>}
        </div>
        <Button type="submit" disabled={isSubmitting || !isDirty} className="w-full">
          {isSubmitting ? 'Saving...' : 'Save Changes'}
        </Button>
      </form>
      <div className="mt-6">
        <Button onClick={handleExportData} disabled={isExporting} className="w-full">
          {isExporting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Exporting...
            </>
          ) : (
            'Export All Data'
          )}
        </Button>
      </div>
    </CardContent>
  </Card>
)