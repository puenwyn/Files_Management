import z, { email } from "zod";

export const forgotPasswordRequestSchema = z.object({
    email: z.string()
});

export type ForgotPasswordRequest = z.infer<typeof forgotPasswordRequestSchema>;