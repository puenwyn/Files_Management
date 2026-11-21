import { PermissionType } from "@/constants/permission-type";
import z from "zod";

export const renameFileResponseSchema = z.object({
    id: z.string(),
    name: z.string(),
    extension: z.string(),
    driveId: z.string().nullable(),
    folderId: z.string().nullable(),
    status: z.enum(["READ_ONLY", "HIDDEN", "MODIFY"]),
    size: z.string(),
    createdAt: z.string(),
    updatedAt: z.string(),
    owner: z.object({
        id: z.string(),
        fullName: z.string(),
    }),
    permissionType: z.enum(PermissionType).nullable(),
});

export type RenameFileResponse = z.infer<
    typeof renameFileResponseSchema
>;