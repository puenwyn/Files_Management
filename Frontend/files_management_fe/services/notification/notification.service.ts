import axiosClient from "@/lib/axios/axios";
import { createApiResponseSchema } from "@/schemas/api-response.schema";
import { NotificationListResponse, notificationListResponseSchema } from "@/schemas/notification/notification-response.schema";

export const notificationService = {
    getNotifications: async (): Promise<NotificationListResponse> => {
        try {
            const response = await axiosClient.get("/notification");

            const result = createApiResponseSchema(
                notificationListResponseSchema
            ).parse(response.data);

            return result.data!;
        } catch (error) {
            throw new Error("Can't connect to server");
        }
    },
};