import { PermissionType } from "@/constants/permission-type";
import z from "zod";

export const resourceDetailUserSchema = z.object({
    id: z.string(),
    fullName: z.string(),
    permissionType: z.enum(PermissionType),
    isOwner: z.boolean(),
});

export const folderDetailResponseSchema = z.object({
    id: z.string(),
    folderName: z.string(),
    driveId: z.string().nullable(),
    createdAt: z.string(),
    updatedAt: z.string(),
    owner: resourceDetailUserSchema,
    users: z.array(resourceDetailUserSchema),
});

export type ResourceDetailUser = z.infer<
    typeof resourceDetailUserSchema
>;

export type FolderDetailResponse = z.infer<
    typeof folderDetailResponseSchema
>;