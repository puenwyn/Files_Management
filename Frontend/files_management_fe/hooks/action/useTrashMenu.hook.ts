import { ActionType } from "@/constants/action-type";
import { MenuItem, trashMenuItems } from "@/constants/dashboard/menu";
import { useRestoreFolder } from "../folder/useRestoreFolder.hook";
import { useConfirmDialogStore } from "@/stores/confirm-dialog.store";

export function useTrashMenu(folderId: string) {
    const {
        restoreFolderMutation,
    } = useRestoreFolder();

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
                                confirmText: "Delete",
                                cancelText: "Cancel",
                                destructive: true,
                                onConfirm: () => {
                                    restoreFolderMutation.mutate(folderId);
                                },
                            }),
                    };

                case ActionType.DELETE:
                    return {
                        ...item,
                        onClick: () =>
                            openConfirm({
                                title: "Delete resource?",
                                description: "Are you sure you want to delete this resource?",
                                confirmText: "Delete",
                                cancelText: "Cancel",
                                destructive: true,
                                onConfirm: () => {
                                    console.log("Hi");
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