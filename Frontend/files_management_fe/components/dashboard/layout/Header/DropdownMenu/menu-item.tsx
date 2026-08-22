import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { ChevronRight } from "lucide-react";

interface MenuItemProps {
    icon: React.ReactNode;
    label: string;
    description: string;
    onSelect: () => void;
    variant?: "default" | "destructive";
}

export default function MenuItem({
    icon,
    label,
    description,
    onSelect,
    variant = "default"
}: MenuItemProps) {
    const isDestructive = variant === "destructive";

    return (
        <DropdownMenuItem
            onClick={onSelect}
            className={`
                gap-3 px-3 py-2 cursor-pointer
                ${isDestructive
                    ? "text-destructive hover:text-destructive focus:text-destructive focus:bg-destructive/10"
                    : ""
                }
            `}
        >
            <span className="shrink-0">{icon}</span>
            <div className="flex-1 flex justify-between items-center">
                <div className="flex flex-col">
                    <span>{label}</span>
                    <span className="text-xs !text-primary-foreground/50">{description}</span>
                </div>
            </div>

            {!isDestructive && (
                <ChevronRight className="size-5 shrink-0" />
            )}
        </DropdownMenuItem>
    )
}