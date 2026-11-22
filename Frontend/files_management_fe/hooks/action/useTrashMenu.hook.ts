import { ActionType } from "@/constants/action-type";
import { MenuItem, trashMenuItems } from "@/constants/dashboard/menu";
import { useRestoreFolder } from "../folder/useRestoreFolder.hook";
import { useRestoreFile } from "../file/useRestoreFile.hook";
import { useDeleteFolder } from "../folder/useDeleteFolder.hook";
import { useDeleteFile } from "../file/useDeleteFile.hook";
import { useConfirmDialogStore } from "@/stores/confirm-dialog.store";
import { ResourceType } from "@/types/resource.type";

export function useTrashMenu(
    resourceId: string,
    resourceType: ResourceType,
    driveId: string | null,
    parentFolderId: string | null
) {
    const { restoreFolderMutation } = useRestoreFolder();
    const { restoreFileMutation } = useRestoreFile();

    const { deleteFolderMutation } = useDeleteFolder(
        resourceId,
        driveId,
        parentFolderId
    );
    const { deleteFileMutation } = useDeleteFile(
        resourceId,
        driveId,
        parentFolderId
    );

    const openConfirm = useConfirmDialogStore(
        (state) => state.openConfirm
    );

    const handleMenuItems = (items: MenuItem[]): MenuItem[] => {
        return items.map((item) => {
            switch (item.action) {
                case ActionType.RESTORE:
                    return {
                        ...item,
                        onClick: () =>
                            openConfirm({
                                title: "Restore resource?",
                                description: "This resource will be restored in your folder",
                                confirmText: "Restore",
                                cancelText: "Cancel",
                                destructive: false,
                                onConfirm: () => {
                                    if (resourceType === ResourceType.FOLDER) {
                                        restoreFolderMutation.mutate(resourceId);
                                    } else {
                                        restoreFileMutation.mutate(resourceId);
                                    }
                                },
                            }),
                    };

                case ActionType.DELETE:
                    return {
                        ...item,
                        onClick: () =>
                            openConfirm({
                                title: "Delete resource?",
                                description: "Are you sure you want to permanently delete this resource?",
                                confirmText: "Delete",
                                cancelText: "Cancel",
                                destructive: true,
                                onConfirm: () => {
                                    if (resourceType === ResourceType.FOLDER) {
                                        deleteFolderMutation.mutate();
                                    } else {
                                        deleteFileMutation.mutate();
                                    }
                                },
                            }),
                    };

                default:
                    return item;
            }
        });
    };

    return {
        items: handleMenuItems(trashMenuItems),
    };
}