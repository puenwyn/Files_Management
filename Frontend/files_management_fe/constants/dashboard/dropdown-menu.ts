import { ChartPie, CircleQuestionMark, LogOut, Settings, ShieldCogCorner, UserRound } from "lucide-react";

export const dropdownmenuItems = [
    {
        label: "My Profile",
        description: "Manage your personal information",
        href: "/profile",
        icon: UserRound,
        seperator: true
    },
    {
        label: "Settings",
        description: "Preferences and configurations",
        href: "/settings",
        icon: Settings
    },
    {
        label: "Security",
        description: "Password and security settings",
        href: "/security",
        icon: ShieldCogCorner
    },
    {
        label: "Storage",
        description: "Manage your storage space",
        href: "/storage",
        icon: ChartPie
    },
    {
        label: "Help & Support",
        description: "Contact us or view help center",
        href: "/help",
        icon: CircleQuestionMark,
        seperator: true
    },
    {
        label: "Log out",
        description: "Log out from your account",
        href: "/profile",
        icon: LogOut,
        seperator: true,
        variant: "destructive" as const
    },
]