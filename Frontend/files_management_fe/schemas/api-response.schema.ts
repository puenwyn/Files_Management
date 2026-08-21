import { z } from "zod";

export const createApiResponseSchema = <T extends z.ZodTypeAny>(
    dataSchema: T
) => {
    return z.object({
        statusCode: z.number(),
        success: z.boolean(),
        error: z
            .object({
                code: z.string(),
                message: z.string(),
            })
            .nullable(),
        data: dataSchema.nullable(),
    });
};