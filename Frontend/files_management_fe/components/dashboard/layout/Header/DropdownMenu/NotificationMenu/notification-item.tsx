import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { notificationConfig } from "@/config/notification.config";
import { NotificationResponse } from "@/schemas/notification/notification-response.schema";
import { NotificationType } from "@/types/notification.type";
import { formatNotificationDate, getNotificationTitle } from "@/utils/notification.util";

interface NotificationItemProps {
    notification: NotificationResponse
}

export default function NotificationItem({
    notification
}: NotificationItemProps) {

    const config = notificationConfig[notification.type];
    const Icon = config.icon;
    const notificationTitle = getNotificationTitle(notification);

    return (
        <DropdownMenuItem className="px-3 py-2 gap-3 cursor-pointer">
            <div className={`flex h-10 w-10 shrink-0 items-center 
                justify-center rounded-full ${config.bgClass}`}>
                <Icon className={`h-5 w-5 ${config.iconClass}`} />
            </div>
            <div className="flex flex-col justify-between flex-1">
                <p>{notificationTitle}</p>
                <span>{formatNotificationDate(notification.createdAt)}</span>
            </div>
            {!notification.isRead && (
                <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-primary" />
            )}
        </DropdownMenuItem>
    )
}