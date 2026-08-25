import { ForgotPasswordRequest, forgotPasswordRequestSchema } from "@/schemas/auth/forgot-password.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

export function useForgotPassword() {
    const form = useForm<ForgotPasswordRequest>({
        resolver: zodResolver(forgotPasswordRequestSchema),
        defaultValues: {
            email: ""
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