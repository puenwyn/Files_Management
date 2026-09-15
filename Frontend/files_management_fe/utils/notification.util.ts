import { NotificationType } from "@/types/notification.type";
import { NotificationResponse } from "@/schemas/notification/notification-response.schema";

export function getNotificationTitle(
    notification: NotificationResponse,
): string {
    switch (notification.type) {
        case NotificationType.SHARE:
            return `Someone shared "${notification.metadata?.resourceName}" with you`;

        case NotificationType.CHANGE_PERMISSION:
            return `Permission changed for "${notification.metadata?.resourceName}"`;

        case NotificationType.CREATE:
            return `"${notification.metadata?.resourceName}" was created`;

        case NotificationType.RENAME:
            return `"${notification.metadata?.oldName}" was renamed to "${notification.metadata?.resourceName}"`;

        default:
            return "You have a new notification";
    }
}

export function formatNotificationDate(date: string): string {
    return new Date(date).toLocaleString("en-EN");
}