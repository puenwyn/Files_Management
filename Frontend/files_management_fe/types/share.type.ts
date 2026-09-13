export type SharePermission = "VIEW" | "EDIT" | "SHARE";

export type ShareAccessType = "RESTRICTED" | "PUBLIC";

export interface SharedUser {
    id: string;
    name: string;
    email: string;
    permission: SharePermission;
    isOwner?: boolean;
}