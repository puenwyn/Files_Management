import z from "zod";

export const verifyPasswordRequestSchema = z.object({
    password: z.string().min(6, "Password must be at least 6 characters")
        .max(100, "Password must be at most 100 characters")
});

export type VerifyPasswordRequest = z.infer<typeof verifyPasswordRequestSchema>;