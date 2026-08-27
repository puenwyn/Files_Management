import axiosClient from "@/lib/axios/axios";
import { createApiResponseSchema } from "@/schemas/api-response.schema";
import { DriveListResponse, driveListResponseSchema, driveResponseSchema } from "@/schemas/drive/drive-response.schema";
import { DriveResponse } from "../../schemas/drive/drive-response.schema";
import axios from "axios";
import { ErrorCode } from "@/constants/error-code";

export const driveService = {
    getDrives: async (): Promise<DriveListResponse> => {
        try {
            const response = await axiosClient.get(
                "/drive"
            );
            const result = createApiResponseSchema(driveListResponseSchema).parse(response.data);
            return result.data!;
        } catch (error) {
            throw new Error("Can't connect to server");
        }
    },

    findDriveById: async (driveId: string): Promise<DriveResponse> => {
        try {
            const response = await axiosClient.get(
                `/drive/${driveId}`
            );
            const result = createApiResponseSchema(driveResponseSchema).parse(response.data);
            return result.data!;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const responseData = error.response?.data;
                if (responseData.error?.code === ErrorCode.NOT_FOUND) {
                    throw new Error("Drive not found");
                }
            }
            throw new Error("Can't connect to server");
        }
    }
}