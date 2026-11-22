
import { ActionType } from "@/constants/action-type";
import { PermissionType } from "@/constants/permission-type";
import { ResourceType } from "@/types/resource.type";
import { fileMenuItems, folderMenuItems, MenuItem } from "@/constants/dashboard/menu";
import { useState } from "react";
import { Star, StarOff } from "lucide-react";
import { useDeleteFolder } from "../folder/useDeleteFolder.hook";
import { useAddStarred } from "../starred/useAddStarred.hook";
import { useRemoveStarred } from "../starred/useRemoveStarred.hook";
import { useResourceDetailStore } from "@/stores/resource-detail.store";
import { useConfirmDialogStore } from "@/stores/confirm-dialog.store";
import { useResourceDialogStore } from "@/stores/resource-dialog.store";
import { useDeleteFile } from "../file/useDeleteFile.hook";

export function useResourceMenu(
    resourceId: string,
    resourceType: ResourceType,
    resourceName: string,
    driveId: string | null,
    parentFolderId: string | null,
    permissionType?: PermissionType | null,
    isStarred: boolean = false,
    extension?: string
) {
    const [hideOpen, setHideOpen] = useState(false);

    const canEdit =
        permissionType === PermissionType.EDIT ||
        permissionType === PermissionType.SHARE;

    const canShare = permissionType === PermissionType.SHARE;

    const openResource = useResourceDetailStore((state) => state.openResource);
    const openConfirm = useConfirmDialogStore((state) => state.openConfirm);

    const openRename = useResourceDialogStore((state) => state.openRename);
    const openShare = useResourceDialogStore((state) => state.openShare);

    const {
        deleteFolderMutation,
        isLoading: isDeleteLoading,
        isError: isDeleteError,
        error: errorLoading,
        isSuccess: isDeleteSuccess,
    } = useDeleteFolder(resourceId, driveId, parentFolderId);

    const {
        deleteFileMutation,
        isLoading: isDeleteFileLoading,
        isError: isDeleteFileError,
        error: fileErrorLoading,
        isSuccess: isDeleteFileSuccess,
    } = useDeleteFile(resourceId, driveId, parentFolderId);

    const { addStarredMutation } = useAddStarred(
        resourceId,
        resourceType
    );

    const { removeStarredMutation } = useRemoveStarred(
        resourceId,
        resourceType
    );

    const isFolder = resourceType === ResourceType.FOLDER;
    const isFile = resourceType === ResourceType.FILE;

    const handleMenuItems = (items: MenuItem[]): MenuItem[] => {
        return items.map((item) => {
            const newItem = { ...item };

            if (item.subMenu) {
                newItem.subMenu = handleMenuItems(item.subMenu);
            }

            switch (item.action) {
                case ActionType.DOWNLOAD:
                    return {
                        ...newItem,
                        onClick: () => {
                            console.log("DOWNLOAD:", resourceType, resourceId);
                        },
                    };

                case ActionType.RENAME:
                    return {
                        ...newItem,
                        disabled: !canEdit,
                        onClick: () => {
                            openRename({
                                id: resourceId,
                                name: resourceName,
                                type: resourceType,
                                driveId,
                                parentFolderId,
                                permissionType,
                                extension,
                            });
                        },
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
                            console.log("SHARE LINK:", resourceType, resourceId);
                        },
                    };

                case ActionType.MANAGE_ACCESS:
                case ActionType.MANAGE_ACCESS:
                    return {
                        ...newItem,
                        disabled: !canShare,
                        onClick: () => {
                            openShare({
                                id: resourceId,
                                name: resourceName,
                                type: resourceType,
                                driveId,
                                parentFolderId,
                                permissionType,
                                extension,
                            });
                        },
                    };

                case ActionType.INFORMATION:
                    return {
                        ...newItem,
                        onClick: () => openResource(resourceId, resourceType),
                    };

                case ActionType.DELETE:
                    return {
                        ...newItem,
                        onClick: () => {
                            openConfirm({
                                title: "Delete resource?",
                                description:
                                    "Are you sure you want to delete this resource?",
                                confirmText: "Delete",
                                cancelText: "Cancel",
                                destructive: true,
                                onConfirm: () => {
                                    if (isFolder) {
                                        deleteFolderMutation.mutate();
                                    } else {
                                        deleteFileMutation.mutate();
                                    }
                                },
                            });
                        },
                    };

                case ActionType.STARRED:
                    return {
                        ...newItem,
                        icon: isStarred ? StarOff : Star,
                        label: isStarred
                            ? "Remove from Starred"
                            : "Add to Starred",
                        onClick: () => {
                            if (isStarred) {
                                removeStarredMutation.mutate();
                            } else {
                                addStarredMutation.mutate();
                            }
                        },
                    };

                default:
                    return newItem;
            }
        });
    };

    const menuConfig = isFolder
        ? folderMenuItems
        : fileMenuItems;

    const items = handleMenuItems(menuConfig);

    return {
        items,
        hideOpen,
        setHideOpen,
        isDeleteLoading,
        isDeleteError,
        errorLoading,
        isDeleteSuccess,
    };
}
