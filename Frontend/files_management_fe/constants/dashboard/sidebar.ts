import { CircleQuestionMark, Clock, Folder, HardDrive, Home, Settings, Star, Trash2, Users } from "lucide-react";

export const sidebarItems = [
    {
        title: "Home",
        icon: Home,
        href: "/home"
    },
    {
        title: "Drives",
        icon: HardDrive,
        href: "/drives"
    },
    {
        title: "Shared",
        icon: Users,
        href: "/shared"
    },
    {
        title: "Recent",
        icon: Clock,
        href: "/recent"
    },
    {
        title: "Starred",
        icon: Star,
        href: "/starred"
    },
    {
        title: "Trash",
        icon: Trash2,
        href: "/trash"
    },
]

export const sidebarStorageItems = [
    {
        title: "Drives",
        icon: HardDrive,
        href: "/drives"
    },
]

export const sidebarFooterItems = [
    {
        title: "Settings",
        icon: Settings,
        href: "/settings"
    },
    {
        title: "Help",
        icon: CircleQuestionMark,
        href: "/help"
    },
]