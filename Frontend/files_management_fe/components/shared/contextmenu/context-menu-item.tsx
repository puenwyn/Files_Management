import { ContextMenuItem } from "@/components/ui/context-menu";

interface AppContextItemProps {
    icon: React.ReactNode;
    action: string;
    destructive?: boolean;
    onClick?: () => void;
}

export default function AppContextMenuItem({
    icon,
    action,
    destructive,
    onClick
}: AppContextItemProps) {
    return (
        <ContextMenuItem
            onClick={onClick}
            className="px-3 py-1.5 cursor-pointer"
            variant={destructive ? "destructive" : "default"}
        >
            <span className="size-4 shrink-0 flex items-center justify-center">
                {icon}
            </span>
            <span className="capitalize">{action}</span>
        </ContextMenuItem>
    )
}