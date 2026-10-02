import axiosClient from "@/lib/axios/axios";
import { createApiResponseSchema } from "@/schemas/api-response.schema";
import {
    StarredListResponse,
    starredListResponseSchema,
} from "@/schemas/starred/starred-response.schema";
import { ResourceType } from "@/types/resource.type";

export const starredService = {
    getStarred: async (): Promise<StarredListResponse> => {
        try {
            const response = await axiosClient.get("/starred");
            const result = createApiResponseSchema(
                starredListResponseSchema
            ).parse(response.data);

            return result.data!;
        } catch (error) {
            throw new Error("Can't connect to server");
        }
    },

    addStarred: async (resourceId: string, resourceType: ResourceType) => {
        try {
            const response = await axiosClient.post(
                "/starred", {
                resourceId,
                resourceType,
            });
            return response.data;
        } catch (error) {
            throw new Error("Can't add resource to starred");
        }
    },

    removeStarred: async (resourceId: string, resourceType: ResourceType) => {
        try {
            const response = await axiosClient.delete("/starred", {
                data: {
                    resourceId,
                    resourceType,
                },
            });
            return response.data;
        } catch (error) {
            throw new Error("Can't remove resource from starred");
        }
    },
};