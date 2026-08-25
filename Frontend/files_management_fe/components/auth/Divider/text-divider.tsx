import { Separator } from "@/components/ui/separator";

interface TextDividerProps {
    text: string;
}

export default function TextDivider({ text }: TextDividerProps) {
    return (
        <div className="flex items-center gap-3">
            <Separator orientation="horizontal" className="flex-1" />
            <span className="text-xs font-medium text-muted-foreground">
                {text}
            </span>
            <Separator orientation="horizontal" className="flex-1" />
        </div>
    );
}