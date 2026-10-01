import { Button } from "@/components/ui/button";

interface AppIconButtonProps {
    icon: React.ElementType;
    dot?: boolean;
    active?: boolean;
    onClick?: () => void;
}

export default function AppIconButton({
    icon: Icon,
    dot = false,
    active = false,
    onClick,
}: AppIconButtonProps) {
    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={onClick}
            className={`
                size-8
                rounded-full
                cursor-pointer
                hover:bg-muted-foreground/30
                active:bg-muted-foreground/10
                ${active
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground"
                }
            `}
        >
            <span className="relative">
                <Icon className="size-5" />

                {dot && (
                    <span
                        className="
                            absolute -right-1 -top-1
                            size-2
                            rounded-full
                            bg-destructive
                            ring-2 ring-background
                        "
                    />
                )}
            </span>
        </Button>
    );
}