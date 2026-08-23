import { Circle, CircleCheck, CircleCheckBig } from "lucide-react";

interface CompletionItemProps {
    title: string;
    completed: boolean;
}

export default function CompletionItem({
    title,
    completed
}: CompletionItemProps) {
    return (
        <div className="flex items-center gap-3">
            <span className={`${completed ? "text-success" : "text-foreground/50"}`}>
                {completed ? <CircleCheckBig className="size-4" /> : <Circle className="size-4" />}
            </span>
            <span>{title}</span>
        </div>
    )
}