<<<<<<< HEAD
import { mutation } from "./_generated/server";



export const calculateEstimate = mutation('estimations.calculate', async ({ vehicleDetails, selectedServices, customizations, tenantId }) => {
  try {
    // Validate input data
    if (!vehicleDetails || !selectedServices || !customizations) {
      throw new Error('Invalid input data');
    }

    // Calculate estimated total
    const estimatedTotal = calculateEstimatedTotal(vehicleDetails, selectedServices, customizations);

    // Generate detailed analysis
    const detailedAnalysis = generateDetailedAnalysis(vehicleDetails, selectedServices, customizations, estimatedTotal);

    // Apply tenant-specific configurations
    const tenantConfig = await getTenantConfig(tenantId);
    if (tenantConfig) {
      estimatedTotal *= tenantConfig.markup;
    }

    return { estimatedTotal, detailedAnalysis };
  } catch (error) {
    console.error('Error calculating estimate:', error);
    throw error;
  }
});

function generateDetailedAnalysis(vehicleDetails: VehicleDetailsType, selectedServices: Array<ServiceType>, customizations: CustomizationsType, estimatedTotal: number): string {
  // Generate a detailed analysis string
  const analysis = `
=======
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
  const {basePrice} = vehicleDetails;
      throw new Error('Failed to calculate estimate');
    }
  },
});

function calculateEstimatedTotal(
  vehicleDetails: VehicleDetailsType,
  selectedServices: Array<ServiceType>,
  return basePrice + serviceCost + customizationCost;


  // Calculate the total cost of selected services
  const serviceCost = selectedServices.reduce(
    (acc, service) => acc  service.price,
    0
  );

  // Calculate the total cost of customizations
  const customizationCost = Object.values(customizations).reduce(
    (acc, customization) => acc  (customization.price || 0),
    0
  );

  // Calculate the estimated total
  return basePrice  serviceCost  customizationCost;
}

function generateDetailedAnalysis(
  vehicleDetails: VehicleDetailsType,
  selectedServices: Array<ServiceType>,
  customizations: CustomizationsType,
  estimatedTotal: number
): string {
  return `
>>>>>>> development
    Vehicle Details:
    - Make: ${vehicleDetails.make}
    - Model: ${vehicleDetails.model}
    - Year: ${vehicleDetails.year}
<<<<<<< HEAD

    Selected Services:
    ${selectedServices.map((service) => `- ${service.name}: $${service.price}`).join('\n')}

    Customizations:
    ${customizations.map((customization) => `- ${customization.name}: $${customization.price}`).join('\n')}

    Estimated Total: $${estimatedTotal.toFixed(2)}
  `;

  return analysis;
}

function calculateEstimatedTotal(vehicleDetails: VehicleDetailsType, selectedServices: Array<ServiceType>, customizations: CustomizationsType): number {
  // Calculate the base price of the vehicle
  const basePrice = vehicleDetails.basePrice;

  // Calculate the total cost of selected services
  let serviceCost = 0;
  for (const service of selectedServices) {
    serviceCost += service.price;
  }

  // Calculate the total cost of customizations
  let customizationCost = 0;
  for (const customization of customizations) {
    customizationCost += customization.price;
  }

  // Calculate the estimated total
  const estimatedTotal = basePrice + serviceCost + customizationCost;

  return estimatedTotal;
}

async function getTenantConfig(tenantId: string): Promise<TenantConfigType | null> {
  // Retrieve tenant-specific configurations from the database or cache
  // ...
async function getTenantConfig(tenantId: string): Promise<TenantConfigType | null> {
  try {
    // Check if the tenant config is cached
    const cachedConfig = await getCachedTenantConfig(tenantId);
    if (cachedConfig) {
      return cachedConfig;
    }

    // Retrieve the tenant config from the database
    const tenantConfig = await db.tenantConfigs.findOne({ where: { tenantId } });

    // If the tenant config is not found, return null
    if (!tenantConfig) {
      return null;
    }

    // Cache the tenant config for future requests
    await cacheTenantConfig(tenantId, tenantConfig);

    return tenantConfig;
=======
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
>>>>>>> development
  } catch (error) {
    console.error('Error retrieving tenant config:', error);
    return null;
  }
}
<<<<<<< HEAD

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
=======
>>>>>>> development
