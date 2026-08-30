import z from "zod";

export const hideFolderRequestSchema = z.object({
    hashPassword: z.string().min(6, "Password must be at least 6 characters")
        .max(10, "Password must be at most 100 characters")
});

export type HideFolderRequest = z.infer<typeof hideFolderRequestSchema>;