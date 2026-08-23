import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Control, Controller, FieldPath, FieldValues } from "react-hook-form";

interface FormTextareaFieldProps<T extends FieldValues> {
    control: Control<T>;
    name: FieldPath<T>;
    label: string;
    placeholder?: string;
    type?: React.HTMLInputTypeAttribute;
    disabled?: boolean;
}

export default function FormTextareaField<T extends FieldValues>({
    control,
    name,
    label,
    placeholder,
    type,
    disabled
}: FormTextareaFieldProps<T>) {
    return (
        <Controller
            control={control}
            name={name}
            render={({ field, fieldState }) => (
                <Field>
                    <FieldLabel htmlFor={name}>
                        {label}
                    </FieldLabel>
                    <Textarea
                        {...field}
                        id={name}
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