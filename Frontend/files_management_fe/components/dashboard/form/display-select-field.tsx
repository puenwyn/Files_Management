import { Field, FieldLabel } from "@/components/ui/field";
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

interface DisplaySelectFieldProps {
    label: string;
    value: string;
    options: SelectOption[];
}

export default function DisplaySelectField({
    label,
    value,
    options,
}: DisplaySelectFieldProps) {
    return (
        <Field>
            <FieldLabel>
                {label}
            </FieldLabel>

            <Select value={value} disabled>
                <SelectTrigger className="w-full">
                    <SelectValue />
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
        </Field>
    );
}