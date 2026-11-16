import { completeFileUploadResponseSchema, completeFileUploadSchema, createFileUploadSchema, uploadFileMetadataSchema, uploadItemResponseSchema, uploadResponseSchema } from "@/schemas/file/upload-file.schema";
import z from "zod";

export type UploadFileMetadata = z.infer<typeof uploadFileMetadataSchema>;
export type CreateFileUploadPayload = z.infer<typeof createFileUploadSchema>;
export type UploadItemResponse = z.infer<typeof uploadItemResponseSchema>;
export type UploadResponse = z.infer<typeof uploadResponseSchema>;
export type CompleteFileUploadPayload = z.infer<typeof completeFileUploadSchema>;
export type CompleteFileUploadResponse = z.infer<typeof completeFileUploadResponseSchema>;

export type UploadFile = {
    file: File;
    metadata: UploadFileMetadata;
    status: "pending" | "uploading" | "success" | "error";
    error?: string;
};