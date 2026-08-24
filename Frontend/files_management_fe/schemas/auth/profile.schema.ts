import { z } from "zod";

export const profileResponseSchema = z.object({
    id: z.string(),
    fullName: z.string(),
    username: z.string(),
    email: z.email(),
    phoneNumber: z.string().nullable(),
    bio: z.string().nullable(),
    dob: z.string().nullable(),
    gender: z.string().nullable(),
    createdAt: z.string(),
    updatedAt: z.string(),
});

export type ProfileResponse = z.infer<typeof profileResponseSchema>;