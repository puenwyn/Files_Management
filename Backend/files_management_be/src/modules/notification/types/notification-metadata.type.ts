import { PermissionType } from "@prisma/client";

export type ShareNotificationMetadata = {
    resourceName: string;
    permission: PermissionType;
}

export type ChangePermissionNotificationMetadata = {
    resourceName: string;
    oldPermission: PermissionType;
    newPermission: PermissionType;
};

export type CreateNotificationMetadata = {
    resourceName: string;
};

export type RenameNotificationMetadata = {
    resourceName: string;
    oldName: string;
};

export type NotificationMetadata =
    | {
        type: "SHARE";
        metadata: ShareNotificationMetadata;
    } | {
        type: "CHANGE_PERMISSION";
        metadata: ChangePermissionNotificationMetadata;
    } | {
        type: "CREATE";
        metadata: CreateNotificationMetadata;
    } | {
        type: "RENAME";
        metadata: RenameNotificationMetadata
    };