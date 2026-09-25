import { ArrowDownToLine, ExternalLink, EyeClosed, FileUp, FolderUp, Info, Link2, LucideIcon, PenLine, Recycle, Trash2 } from "lucide-react";
import { ActionType } from "../action-type";

export type MenuItem = {
    icon?: LucideIcon;
    label: string;
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
        label: "Download",
        action: ActionType.DOWNLOAD,
    },
    {
        icon: PenLine,
        label: "Rename",
        action: ActionType.RENAME,
    },
    {
        icon: EyeClosed,
        label: "Hide",
        action: ActionType.HIDE
    },
    {
        icon: ExternalLink,
        label: "Share",
        action: ActionType.SHARE,
        separator: true,

        subMenu: [
            {
                icon: Link2,
                label: "Share Link",
                action: ActionType.SHARE_LINK,
            },
            {
                label: "Manage Access",
                action: ActionType.MANAGE_ACCESS,
            },
        ],
    },
    {
        icon: Info,
        label: "Information",
        action: ActionType.INFORMATION,
    },
    {
        icon: Trash2,
        label: "Delete",
        action: ActionType.DELETE,
        separator: true,
        destructive: true,
    },
];

export const bgroundMenuItems: MenuItem[] = [
    {
        icon: FolderUp,
        label: "New Folder",
        action: ActionType.NEW_FOLDER,
    },
    {
        icon: FileUp,
        label: "Upload File",
        action: ActionType.UPLOAD_FILE,
        separator: true,
    },
    {
        icon: FolderUp,
        label: "Upload Folder",
        action: ActionType.UPLOAD_FOLDER,
    },
];

export const trashMenuItems: MenuItem[] = [
    {
        icon: Recycle,
        label: "Restore",
        action: ActionType.RESTORE,
    },
    {
        icon: Trash2,
        label: "Delete",
        action: ActionType.DELETE,
    },
]