"use client"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLogin } from "@/hooks/auth/useLogin.hook";
import AuthTextField from "../Button/auth-button";
import { User } from "lucide-react";

export default function LoginForm() {

    const {
        form,
        onSubmit,
        isLoading,
        isError,
        error,
    } = useLogin();

    return (
        <div className="w-1/3 p-4 shadow-sm rounded-lg space-y-4">
            <h1 className="text-3xl font-bold text-center tracking-tight">
                Login
            </h1>
            <form onSubmit={onSubmit} className="space-y-4">
                <AuthTextField
                    name="username"
                    label="Username"
                    placeholder="Enter your username"
                    icon={<User className="size-4" />}
                    register={form.register}
                    error={form.formState.errors.username?.message}
                />

                <AuthTextField
                    name="password"
                    label="Password"
                    type="password"
                    placeholder="Enter your username"
                    icon={<User className="size-4" />}
                    register={form.register}
                    error={form.formState.errors.username?.message}
                />
                <Button type="submit" className="w-full" disabled={isLoading}>Log in</Button>
                {isError && (
                    <p>{error?.message}</p>
                )}
            </form>
        </div>
    )
}