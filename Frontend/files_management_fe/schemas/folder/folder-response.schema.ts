import { PermissionType } from "@/constants/permission-type";
import { z } from "zod";

export const folderOwnerSchema = z.object({
    id: z.string(),
    fullName: z.string(),
});

export const folderResponseSchema = z.object({
    id: z.string(),
    folderName: z.string(),
    parentFolderId: z.string().nullable(),
    driveId: z.string(),
    status: z.enum(["SHOW", "HIDDEN"]),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
    owner: folderOwnerSchema,
    permissionType: z.enum([
        PermissionType.VIEW,
        PermissionType.EDIT,
        PermissionType.SHARE,
    ]).nullable().optional(),
});

export const folderListResponseSchema = z.object({
    folders: z.array(folderResponseSchema),
    showHidden: z.boolean(),
});

export const folderTrashListResponseSchema = z.array(folderResponseSchema);

export type FolderResponse = z.infer<typeof folderResponseSchema>;
export type FolderListCommonResponse = z.infer<typeof folderTrashListResponseSchema>;
export type FolderListResponse = z.infer<typeof folderListResponseSchema>;
export type FolderTrashListResponse = z.infer<typeof folderTrashListResponseSchema>;