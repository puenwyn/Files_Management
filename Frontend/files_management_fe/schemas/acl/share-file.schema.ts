
import { PermissionType } from "@/constants/permission-type";
import { z } from "zod";

export const shareFileRequestSchema = z.object({
    targetUserId: z.string().uuid(),
    permission: z.enum(PermissionType),
});

export type ShareFileRequest = z.infer<
    typeof shareFileRequestSchema
>;

export const shareFileResponseSchema = z.object({
    id: z.string().uuid(),
    userId: z.string().uuid(),
    fileId: z.string().uuid(),
    isOwner: z.boolean(),
    permissionType: z.enum(PermissionType),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
});

export type ShareFileResponse = z.infer<typeof shareFileResponseSchema>;
