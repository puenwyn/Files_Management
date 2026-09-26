import Image from "next/image";
import { ReactNode } from "react";

interface StateViewProps {
    illustration: string;
    title: string;
    description?: string;
    action?: ReactNode
}

export default function StateView({
    illustration,
    title,
    description,
    action
}: StateViewProps) {
    console.log("ILLUSTRATION:", illustration);

    return (
        <div className="flex flex-col items-center">
            <img
                src={illustration}
                alt=""
                width={240}
                height={240}
            />

            <h2 className="mt-3 text-lg font-semibold">{title}</h2>

            {description && (
                <p className="max-w-md text-sm text-muted-foreground">{description}</p>
            )}

            {action && (
                <div>{action}</div>
            )}

        </div>
    )
}