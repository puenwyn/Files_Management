import { toast } from "@/components/ui/toast";
import { ResetPasswordForm, resetPasswordFormSchema } from "@/schemas/auth/reset-password.schema";
import { authService } from "@/services/auth/auth.service";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

export function useResetPassword() {

    const router = useRouter();
    const [email, setEmail] = useState<string | null>(null);

    useEffect(() => {
        const resetPasswordEmail = sessionStorage.getItem("reset_email");
        if (!resetPasswordEmail) {
            router.replace("/forgot-password");
            return;
        }
        setEmail(resetPasswordEmail);
    }, [router])

    const form = useForm<ResetPasswordForm>({
        resolver: zodResolver(resetPasswordFormSchema),
        defaultValues: {
            otp: "",
            newPassword: "",
            confirmPassword: ""
        }
    });

    const resetPasswordMutation = useMutation({
        mutationFn: authService.resetPassword,
        onSuccess: () => {
            sessionStorage.removeItem("reset_email");
            router.replace("/login");
            toast.add({
                type: "success",
                description: "Reset password successfully!"
            });
        },
        onError: (error: Error) => {
            console.log(error);
            toast.add({
                type: "error",
                description: error.message
            });
        },
    })

    const onSubmit = form.handleSubmit(async (data) => {
        console.log(data);
        if (!email) {
            router.replace("/forgot-password");
            return;
        }

        resetPasswordMutation.mutate({
            email,
            otp: data.otp,
            newPassword: data.newPassword,
        });
    });

    return {
        form,
        onSubmit,
        isPending: resetPasswordMutation.isPending
    }
}