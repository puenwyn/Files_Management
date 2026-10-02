
import { ReactNode } from "react";

interface ResourceDetailInfoItemProps {
    title: string;
    content: ReactNode;
}

export default function ResourceDetailInfoItem({
    title,
    content,
}: ResourceDetailInfoItemProps) {
    return (
        <div className="flex items-start justify-between gap-3 text-xs">
            <span className="shrink-0 text-muted-foreground">{title}</span>
            <span className="min-w-0 text-right font-medium text-foreground/90">{content}</span>
        </div>
    );
}