import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

interface DisplayTextFieldProps {
    label: string;
    value: string;
}

export default function DisplayTextField({
    label,
    value,
}: DisplayTextFieldProps) {
    return (
        <Field>
            <FieldLabel>
                {label}
            </FieldLabel>

            <Input
                value={value}
                readOnly
                className="bg-muted/50"
            />
        </Field>
    );
}