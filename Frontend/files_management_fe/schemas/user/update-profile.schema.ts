import { z } from "zod";

export const updateProfileRequestSchema = z.object({
    fullName: z.string().min(1, "Full name is required"),
    phoneNumber: z
        .string()
        .min(10, "Phone number must be at least 10 characters")
        .max(20, "Phone number must be at most 20 characters")
        .optional()
        .or(z.literal("")),
    bio: z.string().optional(),
    dob: z.date().optional(),
    gender: z
        .enum(["Male", "Female", "Other"])
        .optional(),
});

export type UpdateProfileRequest = z.infer<typeof updateProfileRequestSchema>;