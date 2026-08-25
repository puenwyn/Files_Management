import { ResetPasswordRequest, resetPasswordRequestSchema } from "@/schemas/auth/reset-password.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

export function useResetPassword() {
    const form = useForm<ResetPasswordRequest>({
        resolver: zodResolver(resetPasswordRequestSchema),
        defaultValues: {
            otp: "",
            newPassword: ""
        }
    });

    const onSubmit = form.handleSubmit(async (data) => {
        console.log(data);
    });

    return {
        form,
        onSubmit
    }
}