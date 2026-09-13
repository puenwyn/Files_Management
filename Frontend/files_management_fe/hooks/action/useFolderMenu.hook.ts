import { ActionType } from "@/constants/action-type";
import { MenuItem, toolMenuItems } from "@/constants/dashboard/menu";
import { useState } from "react";
import { useDeleteFolder } from "../folder/useDeleteFolder.hook";

export function useFolderMenu(
    folderId: string,
    driveId: string,
    parentFolderId: string | null
) {

    const [renameOpen, setRenameOpen] = useState(false);
    const [hideOpen, setHideOpen] = useState(false);
    const [shareOpen, setShareOpen] = useState(false);

    const {
        deleteFolderMutation,
        isLoading: isDeleteLoading,
        isError: isDeleteError,
        error: errorLoading,
        isSuccess: isDeleteSuccess
    } = useDeleteFolder(folderId, driveId, parentFolderId);

    const handleMenuItems = (items: MenuItem[]): MenuItem[] => {
        return items.map((item) => {
            const newItem = {
                ...item,
            };

            if (item.subMenu) {
                newItem.subMenu = handleMenuItems(item.subMenu);
            }

            switch (item.action) {
                case ActionType.DOWNLOAD:
                    return {
                        ...newItem,
                        onClick: () => {
                            console.log("Download");
                        },
                    };

                case ActionType.RENAME:
                    return {
                        ...newItem,
                        onClick: () => setRenameOpen(true),
                    };

                case ActionType.HIDE:
                    return {
                        ...newItem,
                        onClick: () => setHideOpen(true),
                    };

                case ActionType.SHARE_LINK:
                    return {
                        ...newItem,
                        onClick: () => {
                            console.log("Share link");
                        },
                    };

                case ActionType.MANAGE_ACCESS:
                    return {
                        ...newItem,
                        onClick: () => setShareOpen(!shareOpen),
                    };

                case ActionType.INFORMATION:
                    return {
                        ...newItem,
                        onClick: () => {
                            console.log("Information");
                        },
                    };

                case ActionType.DELETE:
                    return {
                        ...newItem,
                        onClick: () => deleteFolderMutation.mutate(),
                    };

                default:
                    return newItem;
            }
        });
    };

    const items = handleMenuItems(toolMenuItems);

    return {
        items,
        renameOpen,
        setRenameOpen,
        hideOpen,
        setHideOpen,
        shareOpen,
        setShareOpen,
        isDeleteLoading,
        isDeleteError,
        errorLoading,
        isDeleteSuccess,
    }
}