import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { FieldPath, FieldValues, UseFormRegister } from "react-hook-form";

interface AuthTextFieldProps<T extends FieldValues> {
    name: FieldPath<T>;
    label: string;
    placeholder?: string;
    type?: "text" | "email" | "password";
    icon: React.ReactNode;
    register: UseFormRegister<T>;
    error?: string;
}

export default function AuthTextField<T extends FieldValues>({
    name,
    label,
    placeholder,
    type = "text",
    icon,
    register,
    error
}: AuthTextFieldProps<T>) {

    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === "password";

    const inputType = isPassword && showPassword ? "text" : type;

    return (
        <div className="space-y-2">
            <Label htmlFor={name}>
                {label}
            </Label>
            <div className="relative">

                {icon && (
                    <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                        {icon}
                    </div>
                )}

                <Input
                    id={name}
                    type={inputType}
                    placeholder={placeholder}
                    {...register(name)}
                    className={`h-11 rounded-lg ${icon ? "pl-10" : ""}
                        ${isPassword ? "pr-10" : ""} ${error ? "border-destructive" : ""}`}
                />

                {isPassword && (
                    <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="absolute right-3 top-1/2 -translate-y-1/2
                            text-muted-foreground
                            hover:text-foreground"
                    >
                        {showPassword ? (
                            <EyeOff className="size-4" />
                        ) : (
                            <Eye className="size-4" />
                        )}
                    </button>
                )}

                {error && (
                    <p className="text-sm text-destructive">
                        {error}
                    </p>
                )}
            </div>
        </div>
    )
}