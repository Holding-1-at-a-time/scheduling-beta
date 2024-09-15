import { MutationCtx } from './_generated/server.d';
import { Service } from './types';
import { mutation } from "./_generated/server";
import { v } from "convex/values";
import { Id } from './_generated/dataModel.d';
import { ServiceType, VehicleDetailsType, CustomizationsType, EstimationType, TenantConfigType } from '@/types';
import { getTenantConfig } from '@/utils/tenantConfig';

export const calculateEstimate = mutation({
  args: {
    vehicleDetails: v.literal({
      make: v.string(),
      model: v.string(),
      year: v.number(),
      condition: v.string(),
    }),
    selectedServices: v.array(
      v.union({
        id: v.string(),
        name: v.string(),
        price: v.number(),
        duration: v.number(),
      })
    ),
    customizations: v.object({
      [key: string]: {
      name: v.string(),
      price: v.number(),
    }
    })
  tenantId: v.id('tenants'),
  }
});


export const handler = async (ctx: MutationCtx, args: {
  vehicleDetails: VehicleDetailsType;
  selectedServices: Array<ServiceType>;
  customizations: CustomizationsType;
  tenantId: Id<'tenants'>;
}): Promise<EstimationType> => {
  try {
    // Validate input data
    if (!args.vehicleDetails || !args.selectedServices || !args.customizations) {
      throw new Error('Invalid input data');
    }

    // Calculate estimated total
    const estimatedTotal = calculateEstimatedTotal(args.vehicleDetails, args.selectedServices, args.customizations);

    // Generate detailed analysis
    const detailedAnalysis = generateDetailedAnalysis(args.vehicleDetails, args.selectedServices, args.customizations, estimatedTotal);

    // Apply tenant-specific configurations
    const tenantConfig = await getTenantConfig(args.tenantId);
    if (tenantConfig) {
      estimatedTotal *= tenantConfig.markup;
    }

    return { estimatedTotal, detailedAnalysis };
  } catch (error) {
    console.error('Error calculating estimate:', error);
    throw error;
  }
};

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
    ${Object.entries(customizations).map(([key, customization]) => `- ${customization.name}: $${customization.price}`).join('\n')}

    Estimated Total: $${estimatedTotal.toFixed(2)}
  `;

  return analysis;
}

function calculateEstimatedTotal(vehicleDetails: VehicleDetailsType, selectedServices: Array<ServiceType>, customizations: CustomizationsType): number {
  // Calculate the base price of the vehicle
  const basePrice = vehicleDetails.basePrice;

  // Calculate the total cost of selected services
  const serviceCost = selectedServices.reduce((acc, service) => acc + service.price, 0);

  // Calculate the total cost of customizations
  const customizationCost = Object.values(customizations).reduce((acc, customization) => acc + customization.price, 0);

  // Calculate the estimated total
  const estimatedTotal = basePrice + serviceCost + customizationCost;

  return estimatedTotal;
}

async function getTenantConfig(tenantId: string): Promise<TenantConfigType | null> {
  try {
    // Retrieve the tenant config from the database
    const tenantConfig = await db.tenantConfigs.findOne({ where: { tenantId } });

    // If the tenant config is not found, return null
    if (!tenantConfig) {
      return null;
    }

    return tenantConfig;
  } catch (error) {
    console.error('Error retrieving tenant config:', error);
    return null;
  }
}