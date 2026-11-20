import { PermissionType } from "@/constants/permission-type";
import { z } from "zod";

const resourceDetailUserSchema = z.object({
    id: z.string(),
    fullName: z.string(),
    permissionType: z.enum(PermissionType),
    isOwner: z.boolean(),
});

export const fileDetailResponseSchema = z.object({
    id: z.string(),
    name: z.string(),
    extension: z.string(),
    mimeType: z.string(),
    size: z.string(),
    driveId: z.string().nullable(),
    folderId: z.string().nullable(),
    status: z.enum(["READ_ONLY", "HIDDEN", "MODIFY"]),
    previewUrl: z.string().nullable(),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
    accessedAt: z.coerce.date().nullable(),
    owner: resourceDetailUserSchema,
    users: z.array(resourceDetailUserSchema),
});

export type FileDetailResponse = z.infer<typeof fileDetailResponseSchema>;