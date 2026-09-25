import { ErrorCode } from "@/constants/error-code";
import axiosClient from "@/lib/axios/axios";
import { createApiResponseSchema } from "@/schemas/api-response.schema";
import { ForgotPasswordRequest } from "@/schemas/auth/forgot-password.schema";
import { LoginRequest, LoginResponse, loginResponseSchema } from "@/schemas/auth/login.schema";
import { ProfileResponse, profileResponseSchema } from "@/schemas/auth/profile.schema";
import { RegisterRequest } from "@/schemas/auth/register.schema";
import { ResetPasswordRequest } from "@/schemas/auth/reset-password.schema";
import { SessionListResponse, sessionListResponseSchema } from "@/schemas/auth/session.schema";
import { VerifyPasswordRequest } from "@/schemas/auth/verify-password.schema";
import { CommonResponse, commonResponseSchema } from "@/schemas/common/common-response.schema";
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
            console.log("This is error" ,error);
            if (axios.isAxiosError(error)) {
                const responseData = error.response?.data;
                if (responseData.error?.code === ErrorCode.UNAUTHORIZED) {
                    throw new Error("Username or password is unvalid");
                }
            }
            throw new Error("Can't connect to server");
        }
    },

    register: async (data: RegisterRequest): Promise<CommonResponse> => {
        try {
            const response = await axiosClient.post(
                "/auth/register",
                data
            );
            console.log("REGISTER RESPONSE:", response.data);

            const result = createApiResponseSchema(
                commonResponseSchema
            ).parse(response.data);

            console.log("REGISTER PARSED:", result);
            return result.data!;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const responseData = error.response?.data;
                if (responseData.error?.code === ErrorCode.CONFLICT) {
                    throw new Error(responseData.error.message);
                }
            }
            throw new Error("Can't connect to server");
        }
    },

    logout: async (): Promise<CommonResponse> => {
        try {
            const response = await axiosClient.post(
                "/auth/logout"
            );
            const result = createApiResponseSchema(commonResponseSchema).parse(response.data);
            return result.data!;
        } catch (error) {
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

    forgotPassword: async (data: ForgotPasswordRequest): Promise<LoginResponse> => {
        try {
            const response = await axiosClient.post(
                "/auth/forgot-password",
                data
            );
            console.log("API RESPONSE:", response.data);
            const result = createApiResponseSchema(loginResponseSchema).parse(response.data);
            return result.data!;
        } catch (error) {
            throw new Error("Can't connect to server");
        }
    },

    resetPassword: async (data: ResetPasswordRequest): Promise<LoginResponse> => {
        try {
            const response = await axiosClient.post(
                "/auth/reset-password",
                data
            );
            const result = createApiResponseSchema(loginResponseSchema).parse(response.data);
            return result.data!;
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                const responseData = error.response?.data;
                if (responseData?.error?.code === ErrorCode.UNAUTHORIZED) {
                    throw new Error(responseData.error.message);
                }
                if (responseData?.error?.code === ErrorCode.BAD_REQUEST) {
                    throw new Error(responseData.error.message);
                }
            }
            throw new Error("Can't connect to server");
        }
    },

    getDevices: async (): Promise<SessionListResponse> => {
        try {
            const response = await axiosClient.get(
                "/auth/devices",
            );
            const result = createApiResponseSchema(sessionListResponseSchema).parse(response.data);
            return result.data!;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const responseData = error.response?.data;
                if (responseData?.error?.code === ErrorCode.UNAUTHORIZED) {
                    throw new Error(responseData.error.message);
                }
            }
            throw new Error("Can't connect to server");
        }
    },

    verifyPassword: async (data: VerifyPasswordRequest): Promise<CommonResponse> => {
        try {
            const response = await axiosClient.post(
                "/auth/verify-password",
                data
            );
            const result = createApiResponseSchema(commonResponseSchema).parse(response.data);
            return result.data!;
        } catch (error) {
            console.log("Error nè: " + error);
            if (axios.isAxiosError(error)) {
                const responseData = error.response?.data;
                if (responseData?.error?.code === ErrorCode.UNAUTHORIZED) {
                    throw new Error(responseData.error.message);
                }
            }
            throw new Error("Can't connect to server");
        }
    },

    hideHidden: async (): Promise<CommonResponse> => {
        try {
            const response = await axiosClient.post(
                "/auth/hide-hidden"
            );

            const result = createApiResponseSchema(
                commonResponseSchema
            ).parse(response.data);

            return result.data!;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const responseData = error.response?.data;

                if (responseData?.error?.code === ErrorCode.UNAUTHORIZED) {
                    throw new Error(responseData.error.message);
                }
            }

            throw new Error("Can't connect to server");
        }
    },
}