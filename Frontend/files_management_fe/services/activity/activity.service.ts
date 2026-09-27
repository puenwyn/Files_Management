import axiosClient from "@/lib/axios/axios";
import { ActivityListResponse, activityListResponseSchema } from "@/schemas/activity/activity-response.schema";
import { createApiResponseSchema } from "@/schemas/api-response.schema";

export const activityService = {
    getActivities: async (folderId: string): Promise<ActivityListResponse> => {
        try {
            const response = await axiosClient.get(
                `/activity/folder/${folderId}`
            );
            const result = createApiResponseSchema(activityListResponseSchema).parse(response.data);
            return result.data!;
        } catch (error) {
            throw new Error("Can't connect to server");
        }
    }
}