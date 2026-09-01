import { PermissionType } from "@/constants/permission-type";
import { z } from "zod";

export const sharedFolderResponseSchema = z.object({
    id: z.string().uuid(),
    folderId: z.string().uuid(),
    folderName: z.string(),
    parentFolderId: z.string().uuid().nullable(),
    driveId: z.string().uuid(),
    permissionType: z.enum([
        PermissionType.VIEW,
        PermissionType.EDIT,
        PermissionType.SHARE,
    ]),
});

export const sharedFolderListResponseSchema = z.array(sharedFolderResponseSchema);

export type SharedFolderListResponse = z.infer<
    typeof sharedFolderListResponseSchema
>;