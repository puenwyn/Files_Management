import { z } from "zod";

export const sessionResponseSchema = z.object({
    id: z.string().uuid(),
    deviceName: z.string().nullable(),
    ipAddress: z.string().nullable(),
    userAgent: z.string().nullable(),
    createdAt: z.string().datetime(),
    expiresAt: z.string().datetime(),
    isRevoked: z.boolean(),
});

export const sessionListResponseSchema = z.array(sessionResponseSchema);

export type SessionListResponse = z.infer<typeof sessionListResponseSchema>;