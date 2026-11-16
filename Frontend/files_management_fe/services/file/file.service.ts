import { ErrorCode } from "@/constants/error-code";
import axiosClient from "@/lib/axios/axios";
import { createApiResponseSchema } from "@/schemas/api-response.schema";
import { completeFileUploadResponseSchema, uploadResponseSchema } from "@/schemas/file/upload-file.schema";
import { CompleteFileUploadResponse, CreateFileUploadPayload, UploadResponse } from "@/types/file-upload.type";
import axios from "axios";

export const fileService = {
    createUpload: async (payload: CreateFileUploadPayload): Promise<UploadResponse> => {
        try {
            const response = await axiosClient.post(
                "/file/upload",
                payload,
            );
            const result = createApiResponseSchema(uploadResponseSchema).parse(response.data);
            return result.data!;
        } catch (error: unknown) {
            console.log("This is error", error);

            if (axios.isAxiosError(error)) {
                const responseData = error.response?.data;
                if (responseData.error?.code === ErrorCode.BAD_REQUEST) {
                    throw new Error(
                        responseData.error.message ?? "Invalid upload request",
                    );
                }
                if (responseData.error?.code === ErrorCode.NOT_FOUND) {
                    throw new Error("Drive or folder not found");
                }
                if (responseData.error?.code === ErrorCode.FORBIDDEN) {
                    throw new Error(
                        "You don't have permission to upload here",
                    );
                }
            }
            throw new Error("Can't connect to server");
        }
    },

    completeUpload: async (fileVersionId: string): Promise<CompleteFileUploadResponse> => {
        try {
            const response = await axiosClient.post(
                "/file/complete-upload",
                {
                    fileVersionId,
                },
            );
            const result = createApiResponseSchema(completeFileUploadResponseSchema).parse(response.data);
            return result.data!;
        } catch (error: unknown) {
            console.log("This is error", error);
            if (axios.isAxiosError(error)) {
                const responseData = error.response?.data;
                if (responseData.error?.code === ErrorCode.NOT_FOUND) {
                    throw new Error("Uploaded file was not found");
                }
                if (responseData.error?.code === ErrorCode.BAD_REQUEST) {
                    throw new Error(
                        responseData.error.message ??
                        "Uploaded file is invalid",
                    );
                }
                if (responseData.error?.code === ErrorCode.FORBIDDEN) {
                    throw new Error(
                        "You don't have permission to complete this upload",
                    );
                }
            }
            throw new Error("Can't connect to server");
        }
    },

    uploadToStorage: async (url: string, file: File): Promise<void> => {
        const response = await fetch(url, {
            method: "PUT",
            body: file,
            headers: {
                "Content-Type": file.type,
            },
        });
        if (!response.ok) {
            throw new Error(
                `Upload failed with status ${response.status}`,
            );
        }
    },
}