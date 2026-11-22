import { PermissionType } from "@/constants/permission-type";
import { z } from "zod";

// ==================== ENUMS ====================

export const fileStatusSchema = z.enum([
    "READ_ONLY",
    "HIDDEN",
    "MODIFY",
]);

export const scanStatusSchema = z.enum([
    "PENDING",
    "SCANNING",
    "THREAT",
    "VALID",
]);

// ==================== OWNER ====================

export const resourceOwnerResponseSchema = z.object({
    id: z.string(),
    fullName: z.string(),
});

// ==================== FILE VERSION ====================

export const fileVersionResponseSchema = z.object({
    id: z.string(),
    fileId: z.string(),
    blobId: z.string(),
    versionNumber: z.number(),
    mimeType: z.string(),
    size: z.string(),
    encrypt: z.boolean(),
    scanStatus: scanStatusSchema,
    isUploaded: z.boolean(),
    createdAt: z.string(),
    updatedAt: z.string(),
});

// ==================== FILE ====================

export const fileResponseSchema = z.object({
    id: z.string(),
    name: z.string(),
    extension: z.string(),
    driveId: z.string().nullable(),
    folderId: z.string().nullable(),
    status: fileStatusSchema,
    size: z.string(),
    latestVersion: fileVersionResponseSchema.nullable(),
    createdAt: z.string(),
    updatedAt: z.string(),
    accessedAt: z.string().nullable(),
    permissionType: z.enum(PermissionType),
    isAccessed: z.boolean(),
    owner: resourceOwnerResponseSchema,
});

export const fileListResponseSchema = z.array(
    fileResponseSchema,
);

export type FileStatus = z.infer<typeof fileStatusSchema>;
export type ScanStatus = z.infer<typeof scanStatusSchema>;
export type ResourceOwnerResponse = z.infer<typeof resourceOwnerResponseSchema>;
export type FileVersionResponse = z.infer<typeof fileVersionResponseSchema>;
export type FileResponse = z.infer<typeof fileResponseSchema>;
export type FileListResponse = z.infer<typeof fileListResponseSchema>;

// ==================== TRASH FILE ====================

export const trashFileResponseSchema = z.object({
    id: z.string(),
    name: z.string(),
    extension: z.string(),
    driveId: z.string().nullable(),
    folderId: z.string().nullable(),
    status: fileStatusSchema,
    size: z.string(),
    createdAt: z.string(),
    updatedAt: z.string(),
    permissionType: z.enum(PermissionType),
    owner: resourceOwnerResponseSchema,
});

export const trashFileListResponseSchema = z.array(
    trashFileResponseSchema
);

export type TrashFileResponse = z.infer<typeof trashFileResponseSchema>;
export type TrashFileListResponse = z.infer<typeof trashFileListResponseSchema>;