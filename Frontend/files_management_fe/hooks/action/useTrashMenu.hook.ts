import { ActionType } from "@/constants/action-type";
import { MenuItem, trashMenuItems } from "@/constants/dashboard/menu";
import { useRestoreFolder } from "../folder/useRestoreFolder.hook";

export function useTrashMenu(folderId: string) {
    const {
        restoreFolderMutation,
    } = useRestoreFolder();

    const handleMenuItems = (items: MenuItem[]): MenuItem[] => {
        return items.map((item) => {
            switch (item.action) {
                case ActionType.RESTORE:
                    return {
                        ...item,
                        onClick: () => restoreFolderMutation.mutate(folderId),
                    };

                case ActionType.DELETE:
                    return {
                        ...item,
                        onClick: () => {
                            console.log("Delete permanently", folderId);
                        },
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