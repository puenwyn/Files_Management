"use client"
import { LoginRequest, loginRequestSchema } from "@/schemas/auth/login.schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { authService } from "@/services/auth/auth.service";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/toast";

export function useLogin() {
    const router = useRouter();
    const form = useForm<LoginRequest>({
        resolver: zodResolver(loginRequestSchema),
        defaultValues: {
            username: "",
            password: "",
            rememberMe: false,
        }
    });

    const loginMutation = useMutation({
        mutationFn: authService.login,
        onSuccess: (data) => {
            console.log("Login success:", data);
            toast.add({
                type: "success",
                description: "Login successfully!",
            });
            router.push("/login");
        },
        onError: (error) => {
            console.log("Login error:", error.message);
            toast.add({
                type: "error",
                description: "Username or password is invalid!"
            })
        },
    })

    const onSubmit = form.handleSubmit(async (value) => {
        console.log(value);
        loginMutation.mutate(value);
    });

    return {
        form,
        onSubmit,
        isLoading: loginMutation.isPending,
        isError: loginMutation.isError,
        error: loginMutation.error,
        isSuccess: loginMutation.isSuccess,
    }
}