import { PermissionType } from "@/constants/permission-type";
import { z } from "zod";

export const shareFolderResponseSchema = z.object({
    id: z.string().uuid(),
    userId: z.string().uuid(),
    folderId: z.string().uuid(),
    isOwner: z.boolean(),
    permissionType: z.enum([
        PermissionType.VIEW,
        PermissionType.EDIT,
        PermissionType.SHARE,
    ]),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
});

export type ShareFolderResponse = z.infer<
    typeof shareFolderResponseSchema
>;