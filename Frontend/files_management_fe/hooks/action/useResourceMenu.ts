import { ActionType } from "@/constants/action-type";
import { MenuItem, toolMenuItems } from "@/constants/dashboard/menu";
import { useState } from "react";
import { useDeleteFolder } from "../folder/useDeleteFolder.hook";
import { PermissionType } from "@/constants/permission-type";
import { ResourceType } from "@/types/resource.type";
import { useResourceDetailStore } from "@/stores/resource-detail.store";
import { useConfirmDialogStore } from "@/stores/confirm-dialog.store";
import { Star, StarOff } from "lucide-react";
import { useAddStarred } from "../starred/useAddStarred.hook";
import { useRemoveStarred } from "../starred/useRemoveStarred.hook";

export function useResourceMenu(
    resourceId: string,
    resourceType: ResourceType,
    driveId: string,
    parentFolderId: string | null,
    permissionType?: PermissionType | null,
    isStarred: boolean = false
) {

    const [renameOpen, setRenameOpen] = useState(false);
    const [hideOpen, setHideOpen] = useState(false);
    const [shareOpen, setShareOpen] = useState(false);

    const canEdit = permissionType === PermissionType.EDIT || permissionType === PermissionType.SHARE;
    const canShare = permissionType === PermissionType.SHARE;

    const openResource = useResourceDetailStore(
        (state) => state.openResource
    );

    const openConfirm = useConfirmDialogStore(
        (state) => state.openConfirm
    );

    const {
        deleteFolderMutation,
        isLoading: isDeleteLoading,
        isError: isDeleteError,
        error: errorLoading,
        isSuccess: isDeleteSuccess
    } = useDeleteFolder(resourceId, driveId, parentFolderId);

    const { addStarredMutation } = useAddStarred(
        resourceId,
        resourceType
    );

    const { removeStarredMutation } = useRemoveStarred(
        resourceId,
        resourceType
    );

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
                        disabled: !canEdit,
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
                        disabled: !canShare,
                        onClick: () => setShareOpen(!shareOpen),
                    };

                case ActionType.INFORMATION:
                    return {
                        ...newItem,
                        onClick: () => openResource(resourceId, resourceType),
                    };

                case ActionType.DELETE:
                    return {
                        ...newItem,
                        onClick: () =>
                            openConfirm({
                                title: "Delete resource?",
                                description: "Are you sure you want to delete this resource?",
                                confirmText: "Delete",
                                cancelText: "Cancel",
                                destructive: true,
                                onConfirm: () => {
                                    deleteFolderMutation.mutate();
                                },
                            }),
                    };

                case ActionType.STARRED:
                    return {
                        ...newItem,
                        icon: isStarred ? StarOff : Star,
                        label: isStarred
                            ? "Remove from Starred"
                            : "Add to Starred",
                        onClick: () => {
                            console.log("CLICK STARRED");

                            if (isStarred) {
                                console.log("REMOVE");
                                removeStarredMutation.mutate();
                            } else {
                                console.log("ADD");
                                addStarredMutation.mutate();
                            }
                        },
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