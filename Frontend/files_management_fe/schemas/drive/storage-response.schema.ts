import z from "zod";

export const storageResponseSchema = z.object({
    totalSpace: z.number(),
    usedSpace: z.number(),
    usedPercent: z.number()
});

export type StorageResponse = z.infer<typeof storageResponseSchema>;