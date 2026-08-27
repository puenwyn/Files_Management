import { Button } from "@/components/ui/button";

interface AppIconButton {
    icon: React.ElementType;
    dot?: boolean
}

export default function AppIconButton({
    icon: Icon,
    dot = false
}: AppIconButton) {
    return (
        <Button
            variant="ghost"
            size="icon"
            className="
                size-8
                rounded-full
                hover:bg-muted-foreground/30
                active:bg-muted-foreground/10
                cursor-pointer
            "
        >
            <span className="relative">
                <Icon className="size-4" />
                {dot && (
                    <span
                        className="
                        absolute -right-1 -top-1 size-2
                        rounded-full bg-destructive
                        ring-2 ring-background"
                    />
                )}
            </span>
        </Button>
    )
}