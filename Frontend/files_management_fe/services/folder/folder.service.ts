import { ErrorCode } from "@/constants/error-code";
import axiosClient from "@/lib/axios/axios";
import { createApiResponseSchema } from "@/schemas/api-response.schema";
import { FolderListResponse, folderListResponseSchema } from "@/schemas/folder/folder-response.schema";
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
}