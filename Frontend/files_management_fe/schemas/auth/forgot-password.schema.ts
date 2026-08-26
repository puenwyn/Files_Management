import z, { email } from "zod";

export const forgotPasswordRequestSchema = z.object({
    email: z.string().min(1, "Email is required").email("Please enter a valid email"),
});

export type ForgotPasswordRequest = z.infer<typeof forgotPasswordRequestSchema>;