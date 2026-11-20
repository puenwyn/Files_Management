import { z } from "zod";

export const filePreviewResponseSchema = z.object({
    fileId: z.string(),
    name: z.string(),
    extension: z.string(),
    mimeType: z.string(),
    url: z.string().url(),
    expiresIn: z.number(),
});

export type FilePreviewResponse = z.infer<
    typeof filePreviewResponseSchema
>;