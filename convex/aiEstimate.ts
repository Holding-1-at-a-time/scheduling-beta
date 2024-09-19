import { MutationCtx } from './_generated/server.d';
import { mutation } from './_generated/server';
import { v } from 'convex/values';
import { Id } from './_generated/dataModel.d';
import {
  ServiceType,
  VehicleDetailsType,
  CustomizationsType,
  EstimationType,
  TenantConfigType,
} from '@/types';
import { getTenantConfigFromDB } from '@/utils/tenantConfig';

export const calculateEstimate = mutation({
  args: {
    vehicleDetails: v.object({
      make: v.string(),
      model: v.string(),
      year: v.number(),
      condition: v.string(),
      basePrice: v.number(),
    }),
    selectedServices: v.array(
      v.object({
        id: v.string(),
        name: v.string(),
        price: v.number(),
        duration: v.number(),
      })
    ),
    customizations: v.object({
      [v.string()]: v.object({
        name: v.string(),
        price: v.number(),
      }),
    }),
    tenantId: v.id('tenants'),
  },
  handler: async (ctx, args) => {
    // Implementation here
  },
});

export const handler = mutation({
  handler: async (
    ctx: MutationCtx,
    args: {
      vehicleDetails: VehicleDetailsType;
      selectedServices: Array<ServiceType>;
      customizations: CustomizationsType;
      tenantId: Id<'tenants'>;
    }
  ): Promise<EstimationType> => {
    try {
      // Validate input data
      const { vehicleDetails, selectedServices, customizations, tenantId } = args;
      if (
        !vehicleDetails ||
        !selectedServices ||
        !customizations ||
        !tenantId
      ) {
        throw new Error('Invalid input data');
      }

      // Calculate estimated total
      const estimatedTotal = calculateEstimatedTotal(
        vehicleDetails,
        selectedServices,
        customizations
      );

      // Apply tenant-specific configurations
      const tenantConfig = await getTenantConfig(tenantId);
      if (tenantConfig && tenantConfig.markup) {
        tenantConfig.markup = parseFloat(tenantConfig.markup.toString());
        if (!isNaN(tenantConfig.markup)) {
          estimatedTotal *= tenantConfig.markup;
        }
      }

      // Generate detailed analysis
      const detailedAnalysis = generateDetailedAnalysis(
        vehicleDetails,
        selectedServices,
        customizations,
        estimatedTotal
      );

      return { estimatedTotal, detailedAnalysis };
    } catch (error) {
      const { basePrice } = vehicleDetails;
      throw new Error('Failed to calculate estimate');
    }
  },
});

function calculateEstimatedTotal(
  vehicleDetails: VehicleDetailsType,
  selectedServices: Array<ServiceType>,
  customizations: CustomizationsType
): number {
  const { basePrice } = vehicleDetails;

  // Calculate the total cost of selected services
  const serviceCost = selectedServices.reduce(
    (acc, service) => acc + service.price,
    0
  );

  // Calculate the total cost of customizations
  const customizationCost = Object.values(customizations).reduce(
    (acc, customization) => acc + (customization.price || 0),
    0
  );

  // Calculate the estimated total
  return basePrice + serviceCost + customizationCost;
}

function generateDetailedAnalysis(
  vehicleDetails: VehicleDetailsType,
  selectedServices: Array<ServiceType>,
  customizations: CustomizationsType,
  estimatedTotal: number
): string {
  return `
    Vehicle Details:
    - Make: ${vehicleDetails.make}
    - Model: ${vehicleDetails.model}
    - Year: ${vehicleDetails.year}
    - Condition: ${vehicleDetails.condition}
    - Base Price: $${vehicleDetails.basePrice.toFixed(2)}

    Selected Services:
    ${selectedServices
      .map((service) => `- ${service.name}: $${service.price.toFixed(2)}`)
      .join('\n')}

    Customizations:
    ${Object.values(customizations)
      .map(
        (customization) =>
          `- ${customization.name}: $${customization.price.toFixed(2)}`)
      .join('\n')}

    Estimated Total: $${estimatedTotal.toFixed(2)}
  `;
}

async function getTenantConfig(
  tenantId: Id<'tenants'>
): Promise<TenantConfigType | null> {
  try {
    const tenantConfig = await getTenantConfigFromDB(tenantId);
    return tenantConfig || null;
  } catch (error) {
    console.error('Error retrieving tenant config:', error);
    return null;
  }
}

// Helper function to retrieve the cached tenant config
async function getCachedTenantConfig(tenantId: string): Promise<TenantConfigType | null> {
  // Assuming you have a caching mechanism like Redis or Memcached
  const cacheKey = `tenant-config:${tenantId}`;
  const cachedConfig = await cache.get(cacheKey);
  return cachedConfig ? JSON.parse(cachedConfig) : null;
}

// Helper function to cache the tenant config
async function cacheTenantConfig(tenantId: string, tenantConfig: TenantConfigType) {
  // Assuming you have a caching mechanism like Redis or Memcached
  const cacheKey = `tenant-config:${tenantId}`;
  await cache.set(cacheKey, JSON.stringify(tenantConfig));  
  
  return tenantConfig;
}

// Replace the problematic function with:
function calculateTotalPrice(basePrice: number, services: Service[], customizations: Customization[]): number {
  const serviceCost = services.reduce((acc, service) => acc + service.price, 0);
  const customizationCost = customizations.reduce((acc, customization) => acc + customization.price, 0);
  return basePrice + serviceCost + customizationCost;
}

export const generate = mutation({
  args: {
    make: v.string(),
    model: v.string(),
    year: v.string(),
    condition: v.string(),
  },
  handler: async (ctx, args) => {
    // Implement AI-based estimation logic here
    // This is a placeholder implementation
    const estimatedCost = Math.floor(Math.random() * 500) + 100
    const estimatedDuration = Math.floor(Math.random() * 4) + 1

    return {
      cost: estimatedCost,
      duration: estimatedDuration,
    }
  },
})
