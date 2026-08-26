import { ForgotPasswordRequest, forgotPasswordRequestSchema } from "@/schemas/auth/forgot-password.schema";
import { authService } from "@/services/auth/auth.service";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

export function useForgotPassword() {

    const router = useRouter();

    const form = useForm<ForgotPasswordRequest>({
        resolver: zodResolver(forgotPasswordRequestSchema),
        defaultValues: {
            email: ""
        }
    });

    const forgotPasswordMutation = useMutation({
        mutationFn: authService.forgotPassword,

        onSuccess: (_, data) => {
            sessionStorage.setItem(
                "reset_email",
                data.email
            );

            router.push("/reset-password");
        },

        onError: (error: Error) => {
            console.log(error);
        },
    });

    const onSubmit = form.handleSubmit((data) => {
        forgotPasswordMutation.mutate(data);
    });

    return {
        form,
        onSubmit,
        isPending: forgotPasswordMutation.isPending
    }
}