// types.ts

export interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: 'admin' | 'user';
    organizationId: string;
}

export interface Organization {
    id: string;
    name: string;
    slug: string;
    ownerId: string;
}

export type ErrorWithMessage = {
    message: string;
};

export function isErrorWithMessage(error: unknown): error is ErrorWithMessage {
    return (
        typeof error === 'object' &&
        error !== null &&
        'message' in error &&
        typeof (error as Record<string, unknown>).message === 'string'
    );
}

export function toErrorWithMessage(maybeError: unknown): ErrorWithMessage {
    if (isErrorWithMessage(maybeError)) {
        return maybeError;
    }
    try {
        return new Error(JSON.stringify(maybeError));
    } catch {
        return new Error(String(maybeError));
    }
}

export type VehicleDetailsType = {
    make: string;
    model: string;
    year: number;
    condition: string;
    basePrice: number;
};

export type ServiceType = {
    id: string;
    name: string;
    price: number;
    duration: number;
};

export type Id<T extends string> = string & { __brand: T };

export type VehicleType = {
    id: Id<"vehicles">;
    vin: string;
    details: VehicleDetailsType;
    customizations: CustomizationsType;
    ownerId: Id<"users">;
    createdAt: number;
    updatedAt: number;
};

export type AppointmentType = {
    id: Id<"appointments">;
    vehicleId: Id<"vehicles">;
    userId: Id<"users">;
    serviceId: Id<"services">;
    date: string;
    time: string;
    status: 'scheduled' | 'completed' | 'canceled' | 'rescheduled' | 'no-show' | 'in-progress' | 'pending' | 'invoiced' | 'invoice-sent' | 'invoice-paid' | 'invoice-cancelled' | 'invoice-due' | 'invoice-overdue' | 'invoice-voided' | 'invoice-partial' | 'invoice-full';
    notes?: string;
};

export type PartType = {
    id: Id<"parts">;
    name: string;
    description: string;
    price: number;
    quantity: number;
    vehicleCompatibility: string[];
};

export type InvoiceType = {
    id: Id<"invoices">;
    appointmentId: Id<"appointments">;
    userId: Id<"users">;
    vehicleId: Id<"vehicles">;
    services: Array<{ serviceId: Id<"services">; quantity: number }>;
    parts: Array<{ partId: Id<"parts">; quantity: number }>;
    totalAmount: number;
    status: 'pending' | 'paid' | 'cancelled';
    createdAt: number;
    paidAt?: number;
};

export type NotificationType = {
    id: Id<"notifications">;
    userId: Id<"users">;
    message: string;
    type: 'appointment' | 'invoice' | 'system';
    read: boolean;
    createdAt: number;
};

export type PaginationParams = {
    limit: number;
    cursor?: string;
};

export type PaginatedResult<T> = {
    items: T[];
    nextCursor: string | null;
};

export type CustomizationsType = {
    [key: string]: {
        name: string;
        price: number;
    };
};

export type EstimationType = {
    estimatedTotal: number;
    detailedAnalysis: string;
};

export type TenantConfigType = {
    markup: number;
};