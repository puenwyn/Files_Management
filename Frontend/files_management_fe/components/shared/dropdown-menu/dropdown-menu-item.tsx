import { ContextMenuItem } from "@/components/ui/context-menu";
import { DropdownMenu, DropdownMenuItem } from "@/components/ui/dropdown-menu";

interface AppDropdownItemProps {
    icon: React.ReactNode;
    action: string;
    destructive?: boolean
    subMenu?: string;
    onClick?: () => void;
}

export default function AppDropdownMenuItem({
    icon,
    action,
    destructive,
    subMenu,
    onClick
}: AppDropdownItemProps) {
    return (
        <DropdownMenuItem
            onClick={onClick}
            className="px-3 py-1.5 cursor-pointer" variant={destructive ? "destructive" : "default"}
        >
            <span>{icon}</span>
            <span>{action}</span>
        </DropdownMenuItem>
    )
}