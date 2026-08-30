import { toast } from "@/components/ui/toast";
import { VerifyPasswordRequest, verifyPasswordRequestSchema } from "@/schemas/auth/verify-password.schema";
import { authService } from "@/services/auth/auth.service";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";

export function useVerifyPassword(
    onSuccess?: () => void
) {
    const form = useForm<VerifyPasswordRequest>({
        resolver: zodResolver(verifyPasswordRequestSchema),
        defaultValues: {
            password: ""
        }
    });

    const verifyPasswordMutation = useMutation({
        mutationFn: authService.verifyPassword,
        onSuccess: (data) => {
            form.reset();
            onSuccess?.();
            toast.add({
                type: "success",
                description: "Verify password successfully!",
            });
        },
        onError: (error) => {
            console.log("Login error:", error.message);
            toast.add({
                type: "error",
                description: "Password is invalid!"
            })
        },
    });

    const onSubmit = form.handleSubmit(async (value) => {
        console.log(value);
        verifyPasswordMutation.mutate(value);
    });

    return {
        form,
        onSubmit,
        isLoading: verifyPasswordMutation.isPending,
        isError: verifyPasswordMutation.isError,
        error: verifyPasswordMutation.error,
        isSuccess: verifyPasswordMutation.isSuccess,
    }
}