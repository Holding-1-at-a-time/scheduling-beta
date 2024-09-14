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
    Vehicle Details:
    - Make: ${vehicleDetails.make}
    - Model: ${vehicleDetails.model}
    - Year: ${vehicleDetails.year}

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