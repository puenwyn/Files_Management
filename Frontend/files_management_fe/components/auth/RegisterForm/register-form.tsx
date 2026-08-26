"use client"
import { useRegister } from "@/hooks/auth/useRegister.hook";
import AuthTextField from "../Input/auth-textfield";
import { AtSign, Lock, Mail, User } from "lucide-react";
import { Field, FieldLabel } from "@/components/ui/field";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import AuthButton from "../Button/auth-button";
import LoadingOverlay from "@/components/common/loading-overlay";

export default function RegisterForm() {

    const { form, onSubmit, isPending } = useRegister();

    return (
        <>
            <LoadingOverlay loading={isPending} />
            <div className="w-full space-y-4">
                <h1 className="text-3xl font-bold text-center tracking-tight">
                    Register
                </h1>
                <form onSubmit={onSubmit} className="space-y-3">
                    <AuthTextField
                        name="fullName"
                        label="Fullname"
                        placeholder="Enter your full name"
                        leftIcon={<User className="size-4" />}
                        register={form.register}
                        error={form.formState.errors.fullName?.message}
                    />
                    <AuthTextField
                        name="username"
                        label="Username"
                        placeholder="Enter your username"
                        leftIcon={<AtSign className="size-4" />}
                        register={form.register}
                        error={form.formState.errors.username?.message}
                    />
                    <AuthTextField
                        name="email"
                        label="Email"
                        placeholder="Enter your email"
                        leftIcon={<Mail className="size-4" />}
                        register={form.register}
                        error={form.formState.errors.email?.message}
                    />
                    <AuthTextField
                        name="password"
                        label="Password"
                        type="password"
                        placeholder="Enter your username"
                        leftIcon={<Lock className="size-4" />}
                        register={form.register}
                        error={form.formState.errors.password?.message}
                    />
                    <AuthTextField
                        name="confirmPassword"
                        label="Confirm Password"
                        type="password"
                        placeholder="Confirm your password"
                        leftIcon={<Lock className="size-4" />}
                        register={form.register}
                        error={form.formState.errors.confirmPassword?.message}
                    />
                    <Field orientation="horizontal">
                        <Checkbox id="terms-checkbox" name="terms-checkbox" defaultChecked />
                        <FieldLabel className="flex gap-1">
                            <span>I agree to</span>
                            <Link
                                href="/forgot-password"
                                className="text-sm font-medium text-primary cursor-pointer"
                            >
                                Terms of Service
                            </Link>
                            <span>and</span>
                            <Link
                                href="/forgot-password"
                                className="text-sm font-medium text-primary cursor-pointer"
                            >
                                Privacy Policy
                            </Link>
                        </FieldLabel>
                    </Field>
                    <AuthButton
                        type="submit"
                        variant="default">
                        Create account
                    </AuthButton>
                    <section className="flex items-center justify-center gap-1">
                        <span className="text-sm font-medium text-card-foreground">
                            Already have an account?
                        </span>
                        <Link
                            href={"/register"}
                            className="text-sm font-medium text-primary hover:underline underline-offset-4"
                        >
                            Login
                        </Link>
                    </section>
                </form>
            </div>
        </>
    )
}