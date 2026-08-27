import { z } from "zod";

export const driveResponseSchema = z.object({
    id: z.string(),
    driveName: z.string(),
    totalSpace: z.string(),
    usedSpace: z.string(),
    usedPercent: z.number(),
    primary: z.boolean(),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
});

export const driveListResponseSchema = z.array(driveResponseSchema);

export type DriveResponse = z.infer<typeof driveResponseSchema>;
export type DriveListResponse = z.infer<typeof driveListResponseSchema>;