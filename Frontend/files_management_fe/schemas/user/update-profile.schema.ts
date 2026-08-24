import z from "zod";

export const updateProfileRequestSchema = z.object({
    fullName: z.string().min(1, "Fullname is required").max(100, "Full name must be at most 100 characters"),
    phoneNumber: z.string().max(20, "Phone number must be at most 20 characters").optional(),
    bio: z.string().max(500, "Bio must be at most 500 characters").optional(),
    dateOfBirth: z.date().optional(),
    gender: z.enum(["Male", "Female", "Other"]).optional(),
});

export type UpdateProfileRequest = z.infer<typeof updateProfileRequestSchema>;