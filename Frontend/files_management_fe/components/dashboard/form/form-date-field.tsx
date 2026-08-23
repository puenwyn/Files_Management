import {
    Control,
    Controller,
    FieldPathByValue,
    FieldValues,
} from "react-hook-form";

import { CalendarIcon } from "lucide-react";

import {
    Field,
    FieldError,
    FieldLabel,
} from "@/components/ui/field";

import { Button } from "@/components/ui/button";

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

import { Calendar } from "@/components/ui/calendar";

import { cn } from "@/lib/utils";

interface FormDateFieldProps<T extends FieldValues> {
    control: Control<T>;
    name: FieldPathByValue<T, Date | undefined>;
    label: string;
    placeholder?: string;
    disabled?: (date: Date) => boolean;
}

export default function FormDateField<T extends FieldValues>({
    control,
    name,
    label,
    placeholder = "Select date",
    disabled,
}: FormDateFieldProps<T>) {
    return (
        <Controller
            control={control}
            name={name}
            render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={name}>
                        {label}
                    </FieldLabel>

                    <Popover>
                        <PopoverTrigger>
                            <Button
                                id={name}
                                type="button"
                                variant="outline"
                                className={cn(
                                    "w-full justify-between font-normal",
                                    !field.value &&
                                    "text-muted-foreground",
                                )}
                                aria-invalid={fieldState.invalid}
                            >
                                {field.value
                                    ? field.value.toLocaleDateString(
                                        "en-US",
                                        {
                                            month: "long",
                                            day: "numeric",
                                            year: "numeric",
                                        },
                                    )
                                    : placeholder}

                                <CalendarIcon className="size-4 opacity-60" />
                            </Button>
                        </PopoverTrigger>

                        <PopoverContent
                            className="w-auto p-0"
                            align="start"
                        >
                            <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={disabled}
                                
                            />
                        </PopoverContent>
                    </Popover>

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