"use client"
import { useResetPassword } from "@/hooks/auth/useResetPassword";
import { OTPField } from "../Input/otp-field";
import AuthButton from "../Button/auth-button";
import { Label } from "@/components/ui/label";
import AuthTextField from "../Input/auth-textfield";
import { ArrowLeft, Lock, ShieldCheck } from "lucide-react";
import TextDivider from "../Divider/text-divider";
import Link from "next/link";

export default function ResetPasswordForm() {

    const { form, onSubmit } = useResetPassword();
    const otp = form.watch("otp")

    return (
        <div className="w-full space-y-4">
            <h1 className="text-3xl font-bold text-center tracking-tight">
                Reset your password
            </h1>
            <p className="text-sm text-foreground/50">Enter the OTP sent to your email and create a new password</p>
            <form onSubmit={onSubmit} className="space-y-3">
                <Label htmlFor="otp">Verification Code</Label>
                <OTPField
                    value={otp}
                    onChange={(value) => {
                        form.setValue("otp", value, {
                            shouldValidate: true,
                            shouldDirty: true,
                        });
                    }}
                />
                <AuthTextField
                    name="newPassword"
                    label="Password"
                    type="password"
                    placeholder="Enter your username"
                    leftIcon={<Lock className="size-4" />}
                    register={form.register}
                    error={form.formState.errors.newPassword?.message}
                />
                <p className="text-xs text-foreground/50">Use at least 8 characters with a mix of letters, number & symbols.</p>
                <AuthTextField
                    name="newPassword"
                    label="Password"
                    type="password"
                    placeholder="Enter your username"
                    leftIcon={<Lock className="size-4" />}
                    register={form.register}
                    error={form.formState.errors.newPassword?.message}
                />
                <p className="text-xs text-foreground/50">Make sure both passwords match</p>
                <AuthButton
                    type="submit"
                    variant="default">
                    Reset Password
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
        </div>
    )
}