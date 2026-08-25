import z from "zod";

export const resetPasswordRequestSchema = z.object({
    otp: z.string().length(6),
    newPassword: z.string()
});

export type ResetPasswordRequest = z.infer<typeof resetPasswordRequestSchema>;