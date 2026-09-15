import AppIconButton from "@/components/dashboard/iconbutton/app-icon-button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useGetNotifications } from "@/hooks/notification/useGetNotifications.hook";
import { Bell } from "lucide-react";
import NotificationItem from "./notification-item";

export default function NotificationDropdownMenu() {
    const { data: notifications = [], isLoading } = useGetNotifications();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                <AppIconButton icon={Bell} />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 ring-2 ring-border/35 bg-card/75 backdrop-blur-3xl">
                <div className="border-b px-4 py-3">
                    <h3 className="font-semibold">Notifications</h3>
                </div>
                <div className="max-h-[400px] overflow-y-auto">
                    {notifications.map((item) => (
                        <NotificationItem
                            key={item.id}
                            notification={item}
                        />
                    ))}
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}