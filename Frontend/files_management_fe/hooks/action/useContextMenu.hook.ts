import { ActionType } from "@/constants/action-type";
import { bgroundMenuItems, MenuItem } from "@/constants/dashboard/menu";
import { useState } from "react";

export function useContextMenu() {
    const [createFolderOpen, setCreateFolderOpen] = useState(false);

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
                        onClick: () => setCreateFolderOpen(true),
                    };

                case ActionType.UPLOAD_FILE:
                    return {
                        ...newItem,
                        onClick: () => {
                            console.log("Upload file");
                        },
                    };

                case ActionType.UPLOAD_FOLDER:
                    return {
                        ...newItem,
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