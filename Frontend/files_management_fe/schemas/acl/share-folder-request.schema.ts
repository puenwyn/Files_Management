import { PermissionType } from "@/constants/permission-type";
import { z } from "zod";

export const shareFolderRequestSchema = z.object({
    targetUserId: z.string().uuid(),
    permission: z.enum([
        PermissionType.VIEW,
        PermissionType.EDIT,
        PermissionType.SHARE,
    ]),
});

export type ShareFolderRequest = z.infer<
    typeof shareFolderRequestSchema
>;