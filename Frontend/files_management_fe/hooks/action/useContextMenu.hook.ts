import { ActionType } from "@/constants/action-type";
import { bgroundMenuItems, MenuItem } from "@/constants/dashboard/menu";
import { PermissionType } from "@/constants/permission-type";
import { useState } from "react";

export function useContextMenu(
    permissionType?: PermissionType
) {
    const [createFolderOpen, setCreateFolderOpen] = useState(false);
    const canEdit =
        permissionType === undefined ||
        permissionType === PermissionType.EDIT ||
        permissionType === PermissionType.SHARE;

    const handleMenuItems = (items: MenuItem[]): MenuItem[] => {
        return items.map((item) => {
            const newItem = {
                ...item,
            };

            if (item.subMenu) {
                newItem.subMenu = handleMenuItems(item.subMenu);
            }

            switch (item.action) {
                case ActionType.NEW_FOLDER:
                    return {
                        ...newItem,
                        disabled: !canEdit,
                        onClick: () => setCreateFolderOpen(true),
                    };

                case ActionType.UPLOAD_FILE:
                    return {
                        ...newItem,
                        disabled: !canEdit,
                        onClick: () => {
                            console.log("Upload file");
                        },
                    };

                case ActionType.UPLOAD_FOLDER:
                    return {
                        ...newItem,
                        disabled: !canEdit,
                        onClick: () => {
                            console.log("Upload folder");
                        },
                    };

                default:
                    return newItem;
            }
        });
    };

    const items = handleMenuItems(bgroundMenuItems);

    return {
        items,
        createFolderOpen,
        setCreateFolderOpen,
    };
}