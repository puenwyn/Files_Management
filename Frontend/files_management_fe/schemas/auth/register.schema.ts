import z from "zod";

export const registerFormSchema = z.object({
    fullName: z.string().min(1, "Full name is required"),
    username: z.string().min(1, "Username is required"),
    email: z.string().min(1, "Email is required").email("Invalid email address"),
    password: z.string().min(1, "Password is required").min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(8, "Please confirm your password"),
}).refine((data) =>
    data.password === data.confirmPassword,
    {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    }
);

export type RegisterForm = z.infer<typeof registerFormSchema>;

export const registerRequestSchema = z.object({
    fullName: z.string().min(1, "Full name is required"),
    username: z.string().min(1, "Username is required"),
    email: z.string().min(1, "Email is required").email("Invalid email address"),
    password: z.string().min(1, "Password is required").min(6, "Password must be at least 6 characters"),
});

export type RegisterRequest = z.infer<typeof registerRequestSchema>;