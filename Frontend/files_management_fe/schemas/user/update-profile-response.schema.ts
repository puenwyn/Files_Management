import z from "zod";

export const updateProfileResponseSchema = z.object({
    fullName: z.string(),
    email: z.email(),
    phoneNumber: z.string().nullable(),
    bio: z.string().nullable(),
    dob: z.string().nullable(),
    gender: z.enum(["Male", "Female", "Other"]).nullable(),
    updatedAt: z.string(),
});

export type UpdateProfileResponse = z.infer<typeof updateProfileResponseSchema>;