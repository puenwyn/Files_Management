"use client"
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useLogin } from "@/hooks/auth/useLogin.hook";
import AuthTextField from "../Input/auth-textfield";
import { Lock, User } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import AuthButton from "../Button/auth-button";
import TextDivider from "../Divider/text-divider";
import Image from "next/image";
import ThemeToggle from "@/components/theme/theme-toggle";
import Link from "next/link";

export default function LoginForm() {

    const {
        form,
        onSubmit,
        isLoading,
        isError,
        error,
    } = useLogin();

    return (
        <div className="w-2/3 p-8 shadow-[0_2px_12px_2px_rgba(0,0,0,0.08)] rounded-lg space-y-4">
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
                    icon={<Lock className="size-4" />}
                    register={form.register}
                    error={form.formState.errors.username?.message}
                />

                <section className="flex justify-between items-center">
                    <div className="flex gap-1 items-center">
                        <Checkbox
                            id="rememberMe"
                            checked={true}
                            onCheckedChange={() => { }}
                        />
                        <Label htmlFor="rememberMe">Remember me</Label>
                    </div>

                    <Link
                        href="/forgot-password"
                        className="text-sm font-medium text-primary hover:underline underline-offset-4"
                    >
                        Forgot password?
                    </Link>
                </section>

                <AuthButton
                    type="submit"
                    variant="default">
                    Log in
                </AuthButton>

                <TextDivider text={"or continue with"} />

                <AuthButton variant="outline">
                    <Image
                        src={"/icons/google.svg"}
                        alt=""
                        width={18}
                        height={18}
                    />
                    Log in with Google
                </AuthButton>

                <section className="flex items-center justify-center gap-1">
                    <span className="text-sm font-medium text-card-foreground">
                        Don't have an account?
                    </span>
                    <Link
                        href="/forgot-password"
                        className="text-sm font-medium text-primary hover:underline underline-offset-4"
                    >
                        Register
                    </Link>
                </section>
            </form>
        </div>
    )
}