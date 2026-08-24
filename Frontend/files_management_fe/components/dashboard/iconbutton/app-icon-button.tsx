import { Button } from "@/components/ui/button";

interface AppIconButton {
    icon: React.ElementType
}

export default function AppIconButton({
    icon: Icon
}: AppIconButton) {
    return (
        <Button
            variant="ghost"
            size="icon"
            className="
                size-10
                rounded-full
                hover:bg-muted-foreground/30
                active:bg-muted-foreground/10
                cursor-pointer
            "
        >
            <span className="relative">
                <Icon className="size-5" />

                <span
                    className="
                        absolute
                        -right-1 -top-1 size-2
                        rounded-full
                        bg-destructive
                        ring-2
                        ring-background
                    "
                />
            </span>
        </Button>
    )
}