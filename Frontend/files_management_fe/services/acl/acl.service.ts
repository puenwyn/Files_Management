import axiosClient from "@/lib/axios/axios";
import { SharedFolderListResponse, sharedFolderListResponseSchema } from "@/schemas/acl/shared-folder-response.schema";
import { createApiResponseSchema } from "@/schemas/api-response.schema";
import axios from "axios";

export const aclService = {
    getSharedFolders: async (): Promise<SharedFolderListResponse> => {
        try {
            const response = await axiosClient.get(
                "/acl/shared"
            );
            const result = createApiResponseSchema(sharedFolderListResponseSchema).parse(response.data);
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
}