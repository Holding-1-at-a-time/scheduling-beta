

export type UserRole = 'AdminCreator' | 'Management' | 'MemberVerified' | 'Non-Member' | 'Client';

export interface UserMetadata {
    role: UserRole;
    organizationId: string;
    lastLogin: string;
    preferredLanguage: string;
}

export type Permission =
    | 'org:admin'
    | 'org:services:create'
    | 'org:client:create'
    | 'org:client:read'
    | 'org:client:update'
    | 'org:client:delete'