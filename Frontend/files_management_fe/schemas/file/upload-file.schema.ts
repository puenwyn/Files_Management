import { z } from "zod";

export const uploadFileMetadataSchema = z.object({
    label: z.string().uuid(),
    name: z.string().max(100),
    extension: z.string().max(10),
    size: z.number().int().nonnegative(),
    mimeType: z.string().max(100),
    sha256: z.string().max(100),
});

export const createFileUploadSchema = z.object({
    driveId: z.string().uuid().nullable().optional(),
    parentFolderId: z.string().uuid().nullable().optional(),
    files: z.array(uploadFileMetadataSchema),
});

export const uploadItemResponseSchema = z.object({
    label: z.string().uuid(),
    fileId: z.string().uuid(),
    fileVersionId: z.string().uuid(),
    url: z.string().url(),
    objectKey: z.string(),
    expiresIn: z.number(),
});

export const uploadResponseSchema = z.object({
    message: z.string(),
    uploads: z.array(uploadItemResponseSchema),
});

export const completeFileUploadSchema = z.object({
    fileVersionId: z.string().uuid(),
});

export const completeFileUploadResponseSchema = z.object({
    message: z.string(),
    fileVersionId: z.string().uuid(),
    isUploaded: z.boolean(),
});