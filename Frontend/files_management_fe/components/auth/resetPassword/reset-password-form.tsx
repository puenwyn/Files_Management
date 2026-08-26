"use client"
import { useResetPassword } from "@/hooks/auth/useResetPassword";
import { OTPField } from "../Input/otp-field";
import AuthButton from "../Button/auth-button";
import { Label } from "@/components/ui/label";
import AuthTextField from "../Input/auth-textfield";
import { ArrowLeft, Lock, ShieldCheck } from "lucide-react";
import TextDivider from "../Divider/text-divider";
import Link from "next/link";
import LoadingOverlay from "@/components/common/loading-overlay";

export default function ResetPasswordForm() {

    const { form, onSubmit, isPending } = useResetPassword();
    const otp = form.watch("otp")

    return (
        <>
            <LoadingOverlay loading={isPending} />
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
                    {form.formState.errors.otp?.message && (
                        <p className="text-sm text-destructive">
                            {form.formState.errors.otp.message}
                        </p>
                    )}
                    <AuthTextField
                        name="newPassword"
                        label="Password"
                        type="password"
                        placeholder="Enter your new password"
                        leftIcon={<Lock className="size-4" />}
                        register={form.register}
                        error={form.formState.errors.newPassword?.message}
                    />
                    <p className="text-xs text-foreground/50">Use at least 8 characters with a mix of letters, number & symbols.</p>
                    <AuthTextField
                        name="confirmPassword"
                        label="Confirm Password"
                        type="password"
                        placeholder="Confirm your new password"
                        leftIcon={<Lock className="size-4" />}
                        register={form.register}
                        error={form.formState.errors.confirmPassword?.message}
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
        </>
    )
}