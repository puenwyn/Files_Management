import axiosClient from "@/lib/axios/axios";
import { ACLUserListResponse, aclUserListResponseSchema } from "@/schemas/acl/acl-user-response.schema";
import { ShareFolderRequest } from "@/schemas/acl/share-folder-request.schema";
import { ShareFolderResponse, shareFolderResponseSchema } from "@/schemas/acl/share-folder-response.schema";
import { SharedFileListResponse, sharedFileListResponseSchema } from "@/schemas/acl/shared-file-response.schema";
import { SharedFolderListResponse, sharedFolderListResponseSchema } from "@/schemas/acl/shared-folder-response.schema";
import { createApiResponseSchema } from "@/schemas/api-response.schema";
import { FolderListCommonResponse, FolderListResponse, folderTrashListResponseSchema } from "@/schemas/folder/folder-response.schema";
import axios from "axios";

export const aclService = {
    getSharedFolders: async (): Promise<FolderListCommonResponse> => {
        try {
            const response = await axiosClient.get(
                "/acl/shared"
            );
            const result = createApiResponseSchema(folderTrashListResponseSchema).parse(response.data);
            return result.data!;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const responseData = error.response?.data;
                if (responseData?.error?.message) {
                    throw new Error(responseData.error.message);
                }
            }
            throw new Error("Failed to get shared folders");
        }
    },

    async getSharedFolderChildren(
        folderId: string
    ): Promise<FolderListCommonResponse> {
        try {
            const response = await axiosClient.get(
                `/acl/shared/${folderId}/children`
            );

            const result = createApiResponseSchema(
                folderTrashListResponseSchema
            ).parse(response.data);

            return result.data!;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const responseData = error.response?.data;

                if (responseData?.error?.message) {
                    throw new Error(responseData.error.message);
                }
            }

            throw new Error("Failed to get shared folder children");
        }
    },

    getFolderUsers: async (folderId: string): Promise<ACLUserListResponse> => {
        try {
            const response = await axiosClient.get(
                `/acl/folder/${folderId}`
            );
            const result = createApiResponseSchema(aclUserListResponseSchema).parse(response.data);
            return result.data!;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const responseData = error.response?.data;
                if (responseData?.error?.message) {
                    throw new Error(responseData.error.message);
                }
            }
            throw new Error("Failed to get folder users");
        }
    },

    shareFolder: async (
        folderId: string,
        data: ShareFolderRequest,
    ): Promise<ShareFolderResponse> => {
        try {
            const response = await axiosClient.post(
                `/acl/${folderId}/share`,
                data,
            );
            const result = createApiResponseSchema(shareFolderResponseSchema).parse(response.data);

            return result.data!;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const responseData = error.response?.data;

                if (responseData?.error?.message) {
                    throw new Error(responseData.error.message);
                }
            }
            throw new Error("Failed to share folder");
        }
    },

    getSharedFiles: async (): Promise<SharedFileListResponse> => {
        try {
            const response = await axiosClient.get(
                "/acl/shared/files"
            );
            const result = createApiResponseSchema(sharedFileListResponseSchema).parse(response.data);
            return result.data!;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const responseData = error.response?.data;
                if (responseData?.error?.message) {
                    throw new Error(responseData.error.message);
                }
            }
            throw new Error("Failed to get shared files");
        }
    },
}