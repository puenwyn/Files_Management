interface TextDividerProps {
    text: string;
}

export default function TextDivider({ text }: TextDividerProps) {
    return (
        <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-border" />

            <span className="text-xs font-medium text-muted-foreground">
                {text}
            </span>

            <div className="h-px flex-1 bg-border" />
        </div>
    );
}