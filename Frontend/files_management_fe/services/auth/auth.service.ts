import { ErrorCode } from "@/constants/error-code";
import axiosClient from "@/lib/axios/axios";
import { createApiResponseSchema } from "@/schemas/api-response.schema";
import { LoginRequest, LoginResponse, loginResponseSchema } from "@/schemas/auth/login.schema";
import { ProfileResponse, profileResponseSchema } from "@/schemas/auth/profile.schema";
import axios from "axios";

export const authService = {
    login: async (data: LoginRequest): Promise<LoginResponse> => {
        try {
            const response = await axiosClient.post(
                "/auth/login",
                data
            );
            console.log("API RESPONSE:", response.data);
            const result = createApiResponseSchema(loginResponseSchema).parse(response.data);
            return result.data!;
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                const responseData = error.response?.data;
                if (responseData.error?.code === ErrorCode.UNAUTHORIZED) {
                    throw new Error("Username or password is unvalid");
                }
            }
            throw new Error("Can't connect to server");
        }
    },

    getProfile: async (): Promise<ProfileResponse> => {
        const response = await axiosClient.get(
            "/auth/profile"
        );
        console.log("API RESPONSE:", response.data);
        const result = createApiResponseSchema(profileResponseSchema).parse(response.data);
        return result.data!;
    },
}