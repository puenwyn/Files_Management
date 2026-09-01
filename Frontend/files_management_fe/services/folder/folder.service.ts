import { ErrorCode } from "@/constants/error-code";
import axiosClient from "@/lib/axios/axios";
import { createApiResponseSchema } from "@/schemas/api-response.schema";
import { FolderPathResponse, folderPathResponseSchema } from "@/schemas/folder/folder-path-item.schema";
import { FolderListResponse, folderListResponseSchema, FolderResponse, folderResponseSchema, FolderTrashListResponse, folderTrashListResponseSchema } from "@/schemas/folder/folder-response.schema";
import { HideFolderRequest } from "@/schemas/folder/hide-folder.schema";
import { RenameFolderRequest } from "@/schemas/folder/rename-folder.schema";
import { ShowFolderRequest } from "@/schemas/folder/show-folder.schema";
import axios from "axios"

export const folderService = {
    getDriveFolders: async (driveId: string): Promise<FolderListResponse> => {
        try {
            const response = await axiosClient.get(
                `/folder/drive/${driveId}`
            );
            const result = createApiResponseSchema(folderListResponseSchema).parse(response.data);
            return result.data!;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const responseData = error.response?.data;
                if (responseData.error?.code === ErrorCode.NOT_FOUND) {
                    throw new Error("Drive not found");
                }
            }
            throw new Error("Can't connect to server")
        }
    },

    getFolderChildrens: async (folderId: string): Promise<FolderListResponse> => {
        try {
            const response = await axiosClient.get(
                `/folder/${folderId}/children`
            );
            const result = createApiResponseSchema(folderListResponseSchema).parse(response.data);
            return result.data!;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const responseData = error.response?.data;
                if (responseData.error?.code === ErrorCode.NOT_FOUND) {
                    throw new Error("Folder not found");
                }
                if (responseData.error?.code === ErrorCode.FORBIDDEN) {
                    throw new Error("You don't have permission to access this folder");
                }
            }
            throw new Error("Can't connect to server")
        }
    },

    renameFolder: async (folderId: string, data: RenameFolderRequest): Promise<FolderResponse> => {
        try {
            const response = await axiosClient.patch(
                `/folder/${folderId}/rename`,
                data
            );
            const result = createApiResponseSchema(folderResponseSchema).parse(response.data);
            return result.data!;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const responseData = error.response?.data;
                if (responseData.error?.code === ErrorCode.NOT_FOUND) {
                    throw new Error("Folder not found");
                }
            }
            throw new Error("Can't connect to server");
        }
    },

    hideFolder: async (folderId: string, data: HideFolderRequest): Promise<FolderResponse> => {
        try {
            const response = await axiosClient.patch(
                `/folder/${folderId}/hidden`,
                data
            );
            const result = createApiResponseSchema(folderResponseSchema).parse(response.data);
            return result.data!;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const responseData = error.response?.data;
                if (responseData.error?.code === ErrorCode.NOT_FOUND) {
                    throw new Error("Folder not found");
                }
            }
            throw new Error("Can't connect to server");
        }
    },

    showFolder: async (folderId: string, data: ShowFolderRequest): Promise<FolderResponse> => {
        try {
            const response = await axiosClient.patch(
                `/folder/${folderId}/show`,
                data
            );
            const result = createApiResponseSchema(folderResponseSchema).parse(response.data);
            return result.data!;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const responseData = error.response?.data;
                if (responseData.error?.code === ErrorCode.NOT_FOUND) {
                    throw new Error("Folder not found");
                }
            }
            throw new Error("Can't connect to server");
        }
    },

    deleteFolder: async (folderId: string): Promise<FolderResponse> => {
        try {
            const response = await axiosClient.delete(
                `/folder/${folderId}/delete`
            );
            const result = createApiResponseSchema(folderResponseSchema).parse(response.data);
            return result.data!;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const responseData = error.response?.data;
                if (responseData.error?.code === ErrorCode.NOT_FOUND) {
                    throw new Error("Folder not found");
                }
            }
            throw new Error("Can't connect to server");
        }
    },

    getTrashFolders: async (): Promise<FolderTrashListResponse> => {
        try {
            const response = await axiosClient.get(
                `/folder/trash`
            );
            const result = createApiResponseSchema(folderTrashListResponseSchema).parse(response.data);
            return result.data!;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const responseData = error.response?.data;
                if (responseData.error?.code === ErrorCode.UNAUTHORIZED) {
                    throw new Error("Unauthorized");
                }
            }
            throw new Error("Can't connect to server");
        }
    },

    getFolderPath: async (
        folderId: string
    ): Promise<FolderPathResponse> => {
        try {
            const response = await axiosClient.get(
                `/folder/${folderId}/path`
            );

            const result = createApiResponseSchema(
                folderPathResponseSchema
            ).parse(response.data);

            return result.data!;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const responseData = error.response?.data;

                if (responseData.error?.code === ErrorCode.NOT_FOUND) {
                    throw new Error("Folder not found");
                }

                if (responseData.error?.code === ErrorCode.FORBIDDEN) {
                    throw new Error(
                        "You don't have permission to access this folder"
                    );
                }
            }

            throw new Error("Can't connect to server");
        }
    },
}