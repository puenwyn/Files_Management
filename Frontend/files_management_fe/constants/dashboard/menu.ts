import { ArrowDownToLine, ExternalLink, EyeClosed, FileUp, FolderUp, Info, Link2, LucideIcon, PenLine, Trash2 } from "lucide-react";

export type MenuItem = {
    icon?: LucideIcon;
    action: string;
    separator?: boolean;
    destructive?: boolean;
    disabled?: boolean;
    onClick?: () => void;
    subMenu?: MenuItem[];
};

export const toolMenuItems: MenuItem[] = [
    {
        icon: ArrowDownToLine,
        action: "Download",
    },
    {
        icon: PenLine,
        action: "Rename",
    },
    {
        icon: EyeClosed,
        action: "Hide"
    },
    {
        icon: ExternalLink,
        action: "Share",
        separator: true,

        subMenu: [
            {
                icon: Link2,
                action: "Share link",
            },
            {
                action: "Manage access",
            },
        ],
    },
    {
        icon: Info,
        action: "Information",
    },
    {
        icon: Trash2,
        action: "Delete",
        separator: true,
        destructive: true,
    },
];

export const bgroundMenuItems: MenuItem[] = [
    {
        icon: ArrowDownToLine,
        action: "New Folder",
    },
    {
        icon: FolderUp,
        action: "Upload File",
        separator: true
    },
    {
        icon: FileUp,
        action: "Upload Folder",
    },
]