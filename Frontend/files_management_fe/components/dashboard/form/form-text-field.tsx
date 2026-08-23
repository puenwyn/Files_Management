import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Control, Controller, FieldPath, FieldValues } from "react-hook-form";

interface FormTextFieldProps<T extends FieldValues> {
    control: Control<T>;
    name: FieldPath<T>;
    label: string;
    placeholder?: string;
    type?: React.HTMLInputTypeAttribute;
    disabled?: boolean;
}

export default function FormTextField<T extends FieldValues>({
    control,
    name,
    label,
    placeholder,
    type,
    disabled
}: FormTextFieldProps<T>) {
    return (
        <Controller
            control={control}
            name={name}
            render={({ field, fieldState }) => (
                <Field>
                    <FieldLabel htmlFor={name}>
                        {label}
                    </FieldLabel>
                    <Input
                        {...field}
                        id={name}
                        type={type}
                        placeholder={placeholder}
                        disabled={disabled}
                    />
                    {fieldState.error && (
                        <FieldError>
                            {fieldState.error.message}
                        </FieldError>
                    )}
                </Field>
            )}
        />
    )
}