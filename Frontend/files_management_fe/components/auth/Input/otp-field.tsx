import { useRef } from "react";

type OtpInputProps = {
    value: string;
    onChange: (value: string) => void;
};

export function OTPField({ value, onChange }: OtpInputProps) {
    const inputRef = useRef<HTMLInputElement>(null);

    const digits = Array.from(
        { length: 6 },
        (_, index) => value[index] || ""
    );

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const newValue = e.target.value
            .replace(/\D/g, "")
            .slice(0, 6);

        onChange(newValue);
    };

    return (
        <div
            className="relative flex gap-5 cursor-text"
            onClick={() => inputRef.current?.focus()}
        >
            <input
                ref={inputRef}
                value={value}
                onChange={handleChange}
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={6}
                className="absolute inset-0 h-full w-full cursor-text opacity-0"
            />

            {digits.map((digit, index) => (
                <div
                    key={index}
                    className={`
                        flex h-12 w-12 items-center justify-center
                        rounded-lg border bg-background
                        text-xl font-semibold
                        transition-all

                        ${index === value.length
                            ? "border-primary ring-2 ring-primary/15"
                            : "border-border"
                        }
                    `}
                >
                    {digit}
                </div>
            ))}
        </div>
    );
}