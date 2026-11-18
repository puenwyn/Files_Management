import { PermissionType } from "@/constants/permission-type";
import { ResourceType } from "@/types/resource.type";
import { z } from "zod";

export const sharedFileResponseSchema = z.object({
    id: z.string().uuid(),
    name: z.string(),
    folderId: z.string().uuid().nullable(),
    driveId: z.string().uuid(),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
    owner: z.object({
        id: z.string().uuid(),
        fullName: z.string(),
    }),
    permissionType: z.enum([
        PermissionType.VIEW,
        PermissionType.EDIT,
        PermissionType.SHARE,
    ]),
    resourceType: z.literal(ResourceType.FILE),
});

export const sharedFileListResponseSchema = z.array(
    sharedFileResponseSchema
);

export type SharedFileResponse = z.infer<
    typeof sharedFileResponseSchema
>;

export type SharedFileListResponse = z.infer<
    typeof sharedFileListResponseSchema
>;