import { ActivityAction, PermissionType } from "@prisma/client";

export type CreateActivityMetadata = {
    folderName: string;
}

export type RenameActivityMetadata = {
    oldName: string;
    newName: string;
}

export type ShareActivityMetadata = {
    targetUserId: string;
    targetUserName: string;
    permission: PermissionType;
}

export type ChangePermissionActivityMetadata = {
    targetUserId: string;
    targetUserName: string;
    oldPermission: PermissionType;
    newPermission: PermissionType;
};

export type ActivityMetadata =
    | {
        action: "CREATE";
        metadata: CreateActivityMetadata;
    }
    | {
        action: "RENAME";
        metadata: RenameActivityMetadata;
    }
    | {
        action: "SHARE";
        metadata: ShareActivityMetadata;
    }
    | {
        action: "CHANGE_PERMISSION";
        metadata: ChangePermissionActivityMetadata;
    };