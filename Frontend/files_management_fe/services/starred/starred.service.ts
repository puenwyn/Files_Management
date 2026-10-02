import axiosClient from "@/lib/axios/axios";
import { createApiResponseSchema } from "@/schemas/api-response.schema";
import {
    StarredListResponse,
    starredListResponseSchema,
} from "@/schemas/starred/starred-response.schema";

export const starredService = {
    getStarred: async (): Promise<StarredListResponse> => {
        try {
            await new Promise((resolve) => setTimeout(resolve, 2000));
            const response = await axiosClient.get("/starred");
            const result = createApiResponseSchema(
                starredListResponseSchema
            ).parse(response.data);

            return result.data!;
        } catch (error) {
            throw new Error("Can't connect to server");
        }
    },
};