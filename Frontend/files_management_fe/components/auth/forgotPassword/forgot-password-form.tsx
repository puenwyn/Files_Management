"use client"
import { useForgotPassword } from "@/hooks/auth/useForgotPassword.hook";
import AuthTextField from "../Input/auth-textfield";
import { ArrowLeft, Mail, ShieldCheck } from "lucide-react";
import AuthButton from "../Button/auth-button";
import TextDivider from "../Divider/text-divider";
import Link from "next/link";
import LoadingOverlay from "@/components/common/loading-overlay";

export default function ForgotPasswordForm() {

    const { form, onSubmit, isPending } = useForgotPassword();

    return (
        <>
            <LoadingOverlay loading={isPending} />
            <div className="w-full space-y-4">
                <h1 className="text-3xl font-bold text-center tracking-tight">
                    Forgot Password
                </h1>
                <p className="text-sm text-foreground/50">Enter your email address and we'll send you a 6-digit verification code to reset your password</p>
                <form onSubmit={onSubmit} className="space-y-3">
                    <AuthTextField
                        name="email"
                        label="Email"
                        placeholder="Enter your email"
                        leftIcon={<Mail className="size-4" />}
                        register={form.register}
                        error={form.formState.errors.email?.message}
                    />
                    <p className="text-xs text-foreground/50">We'll send a 6-digit OTP code to this email address</p>
                    <AuthButton
                        type="submit"
                        variant="default">
                        Send OTP Reset
                    </AuthButton>
                </form>

                <TextDivider text="or" />

                <Link
                    href={"/login"}
                    className="text-sm font-medium text-primary flex items-center justify-center"
                >
                    <ArrowLeft />
                    <span>Back to Login</span>
                </Link>

                <div className="flex justify-between p-3 rounded-lg bg-primary/10 gap-3 text-primary">
                    <ShieldCheck className="size-10" />
                    <p className="text-sm text-foreground/50">For your security, the OTP code will expire after 5 minutes</p>
                </div>
            </div>
        </>
    )
}