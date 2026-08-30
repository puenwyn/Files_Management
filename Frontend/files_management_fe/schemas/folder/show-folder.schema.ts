import z from "zod";

export const showFolderRequestSchema = z.object({
    comparePassword: z.string().min(6, "Password must be at least 6 characters")
        .max(10, "Password must be at most 100 characters")
});

export type ShowFolderRequest = z.infer<typeof showFolderRequestSchema>;