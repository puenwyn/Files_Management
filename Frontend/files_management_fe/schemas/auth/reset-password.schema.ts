import z from "zod";

export const resetPasswordFormSchema = z.object({
    otp: z.string().length(6, "OTP must be 6 digits"),
    newPassword: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(8, "Please confirm your password"),
}).refine((data) =>
    data.newPassword === data.confirmPassword,
    {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    }
);

export type ResetPasswordForm = z.infer<typeof resetPasswordFormSchema>;

export const resetPasswordRequestSchema = z.object({
    email: z.string().email(),
    otp: z.string().length(6),
    newPassword: z.string().min(8),
});

export type ResetPasswordRequest = z.infer<
    typeof resetPasswordRequestSchema
>;