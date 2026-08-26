import z from "zod";

export const commonResponseSchema = z.object({
    message: z.string()
});
export type CommonResponse = z.infer<typeof commonResponseSchema>;