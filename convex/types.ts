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
    if (isErrorWithMessage(maybeError)) return maybeError;

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

export type Id<T extends string> = string & { __brand: T };