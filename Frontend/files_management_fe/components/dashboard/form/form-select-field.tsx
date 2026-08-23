import {
    Control,
    Controller,
    FieldPath,
    FieldValues,
} from "react-hook-form";

import {
    Field,
    FieldError,
    FieldLabel,
} from "@/components/ui/field";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface SelectOption {
    label: string;
    value: string;
}

interface FormSelectFieldProps<T extends FieldValues> {
    control: Control<T>;
    name: FieldPath<T>;
    label: string;
    placeholder?: string;
    options: SelectOption[];
    disabled?: boolean;
}

export default function FormSelectField<T extends FieldValues>({
    control,
    name,
    label,
    placeholder = "Select an option",
    options,
    disabled = false,
}: FormSelectFieldProps<T>) {
    return (
        <Controller
            control={control}
            name={name}
            render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={name}>
                        {label}
                    </FieldLabel>

                    <Select
                        value={field.value}
                        onValueChange={field.onChange}
                        disabled={disabled}
                    >
                        <SelectTrigger
                            id={name}
                            aria-invalid={fieldState.invalid}
                            className="w-full"
                        >
                            <SelectValue
                                placeholder={placeholder}
                            />
                        </SelectTrigger>

                        <SelectContent>
                            {options.map((option) => (
                                <SelectItem
                                    key={option.value}
                                    value={option.value}
                                >
                                    {option.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    {fieldState.error && (
                        <FieldError>
                            {fieldState.error.message}
                        </FieldError>
                    )}
                </Field>
            )}
        />
    );
}