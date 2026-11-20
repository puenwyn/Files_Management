
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
    isOwner: z.boolean(),
    isAccessed: z.boolean(),
});

export const fileListResponseSchema = z.array(
    fileResponseSchema,
);

export type FileStatus = z.infer<typeof fileStatusSchema>;
export type ScanStatus = z.infer<typeof scanStatusSchema>;
export type FileVersionResponse = z.infer<typeof fileVersionResponseSchema>;
export type FileResponse = z.infer<typeof fileResponseSchema>;
export type FileListResponse = z.infer<typeof fileListResponseSchema>;
