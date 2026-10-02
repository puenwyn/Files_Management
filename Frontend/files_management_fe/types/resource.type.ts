import { PermissionType } from "@/constants/permission-type";

export enum ResourceType {
    FOLDER = "FOLDER",
    FILE = "FILE"
}

export interface Resource {
    id: string;
    name: string;
    type: ResourceType;
    driveId: string | null;
    parentFolderId: string | null;
    permissionType?: PermissionType | null;
    status?: "SHOW" | "HIDDEN";
    isAccessed?: boolean;
}