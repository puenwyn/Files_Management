"use client"
import { RegisterRequest, registerRequestSchema } from "@/schemas/auth/register.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

export function useRegister() {
    const form = useForm<RegisterRequest>({
        resolver: zodResolver(registerRequestSchema),
        defaultValues: {
            fullName: "",
            username: "",
            email: "",
            password: ""
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