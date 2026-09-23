import { ContextMenuItem } from "@/components/ui/context-menu";
import { DropdownMenu, DropdownMenuItem } from "@/components/ui/dropdown-menu";

interface AppDropdownItemProps {
    icon: React.ReactNode;
    action: string;
    destructive?: boolean
    disabled?: boolean
    onClick?: () => void;
}

export default function AppDropdownMenuItem({
    icon,
    action,
    destructive,
    disabled,
    onClick
}: AppDropdownItemProps) {
    return (
        <DropdownMenuItem
            disabled={disabled}
            onClick={onClick}
            className="px-3 py-1.5 cursor-pointer" variant={destructive ? "destructive" : "default"}
        >
            <span className="size-4 shrink-0 flex items-center justify-center">
                {icon}
            </span>
            <span className="capitalize">{action}</span>
        </DropdownMenuItem>
    )
}