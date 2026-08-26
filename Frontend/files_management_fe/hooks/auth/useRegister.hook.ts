"use client"
import { toast } from "@/components/ui/toast";
import { RegisterForm, registerFormSchema, RegisterRequest, registerRequestSchema } from "@/schemas/auth/register.schema";
import { authService } from "@/services/auth/auth.service";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

export function useRegister() {

    const router = useRouter();

    const form = useForm<RegisterForm>({
        resolver: zodResolver(registerFormSchema),
        defaultValues: {
            fullName: "",
            username: "",
            email: "",
            password: "",
            confirmPassword: ""
        }
    });

    const registerMutatation = useMutation({
        mutationFn: authService.register,
        onSuccess: (data) => {
            console.log("Login success:", data);
            toast.add({
                type: "success",
                description: "Register successfully!",
            });
            router.push("/login");
        },
        onError: (error) => {
            console.log("Login error:", error.message);
        },
    })

    const onSubmit = form.handleSubmit(async (data) => {
        console.log(data);
        registerMutatation.mutate({
            fullName: data.fullName,
            username: data.username,
            email: data.email,
            password: data.password
        });
    });

    return {
        form,
        onSubmit,
        isPending: registerMutatation.isPending
    }
}