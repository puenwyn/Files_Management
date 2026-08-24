import AppIconButton from "@/components/dashboard/iconbutton/app-icon-button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Bell } from "lucide-react";

export default function NotificationDropdownMenu() {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                <AppIconButton icon={Bell} />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem>
                    Hi
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}