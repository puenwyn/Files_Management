import { ErrorCode } from "@/constants/error-code";
import axiosClient from "@/lib/axios/axios";
import { createApiResponseSchema } from "@/schemas/api-response.schema";
import { UpdateProfileResponse, updateProfileResponseSchema } from "@/schemas/user/update-profile-response.schema";
import { UpdateProfileRequest } from "@/schemas/user/update-profile.schema";
import axios from "axios";

export const userService = {
    updateProfile: async (data: UpdateProfileRequest): Promise<UpdateProfileResponse> => {
        try {
            const response = await axiosClient.patch(
                "/user/profile",
                data
            )
            console.log("API RESPONSE:", response.data);
            const result = createApiResponseSchema(updateProfileResponseSchema).parse(response.data);
            return result.data!;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const responseData = error.response?.data;
                if (responseData.error?.code === ErrorCode.NOT_FOUND) {
                    throw new Error("User not found");
                }
            }
            throw new Error("Can't connect to server")
        }
    }
}