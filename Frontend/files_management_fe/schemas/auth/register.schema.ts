import z from "zod";

export const registerRequestSchema = z.object({
    fullName: z.string().min(1, "Full name is required"),
    username: z.string().min(1, "Username is required"),
    email: z.string().min(1, "Email is required").email("Invalid email address"),
    password: z.string().min(1, "Password is required").min(6, "Password must be at least 6 characters"),
});

export type RegisterRequest = z.infer<typeof registerRequestSchema>;