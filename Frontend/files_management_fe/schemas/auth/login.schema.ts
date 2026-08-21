import z from "zod";

export const loginRequestSchema = z.object({
    username: z.string().min(1, "Username is required"),
    password: z.string().min(1, "Password is required"),
    rememberMe: z.boolean().optional()
});
export type LoginRequest = z.infer<typeof loginRequestSchema>;

export const loginResponseSchema = z.object({
    message: z.string()
});
export type LoginResponse = z.infer<typeof loginResponseSchema>;