import {
    Field,
    FieldError,
    FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import {
    FieldPath,
    FieldValues,
    UseFormRegister,
} from "react-hook-form";

interface AuthTextFieldProps<T extends FieldValues> {
    register: UseFormRegister<T>;
    name: FieldPath<T>;
    label: string;
    placeholder?: string;
    type?: React.HTMLInputTypeAttribute;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    error?: string;
    disabled?: boolean;
}

export default function AuthTextField<T extends FieldValues>({
    register,
    name,
    label,
    placeholder,
    type = "text",
    leftIcon,
    rightIcon,
    error,
    disabled,
}: AuthTextFieldProps<T>) {
    const [showPassword, setShowPassword] = useState(false);

    const isPassword = type === "password";
    const inputType = isPassword && showPassword ? "text" : type;

    return (
        <Field>
            <FieldLabel htmlFor={name}>
                {label}
            </FieldLabel>

            <div className="relative">
                {leftIcon && (
                    <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                        {leftIcon}
                    </div>
                )}

                <Input
                    {...register(name)}
                    id={name}
                    type={inputType}
                    placeholder={placeholder}
                    disabled={disabled}
                    className={`
                        h-10
                        text-[15px]
                        ${leftIcon ? "pl-10" : ""}
                        ${rightIcon || isPassword ? "pr-10" : ""}
                    `}
                />

                {isPassword ? (
                    <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        disabled={disabled}
                        className="
                            absolute right-3 top-1/2
                            -translate-y-1/2
                            text-muted-foreground
                            hover:text-foreground
                            disabled:pointer-events-none
                            disabled:opacity-50
                        "
                    >
                        {showPassword ? (
                            <EyeOff className="size-4" />
                        ) : (
                            <Eye className="size-4" />
                        )}
                    </button>
                ) : (
                    rightIcon && (
                        <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                            {rightIcon}
                        </div>
                    )
                )}
            </div>

            {error && (
                <FieldError>
                    {error}
                </FieldError>
            )}
        </Field>
    );
}