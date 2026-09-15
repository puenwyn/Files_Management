import {
    Bell,
    FolderPlus,
    Pencil,
    Share,
    ShieldCheck,
} from "lucide-react";
import { NotificationType } from "@/types/notification.type";

export const notificationConfig: Record<
    NotificationType,
    {
        icon: typeof Bell;
        iconClass: string;
        bgClass: string;
    }
> = {
    [NotificationType.SHARE]: {
        icon: Share,
        iconClass: "text-blue-600",
        bgClass: "bg-blue-100",
    },

    [NotificationType.CHANGE_PERMISSION]: {
        icon: ShieldCheck,
        iconClass: "text-purple-600",
        bgClass: "bg-purple-100",
    },

    [NotificationType.CREATE]: {
        icon: FolderPlus,
        iconClass: "text-green-600",
        bgClass: "bg-green-100",
    },

    [NotificationType.RENAME]: {
        icon: Pencil,
        iconClass: "text-orange-600",
        bgClass: "bg-orange-100",
    },

    [NotificationType.UPLOAD]: {
        icon: Pencil,
        iconClass: "text-orange-600",
        bgClass: "bg-orange-100",
    },
};