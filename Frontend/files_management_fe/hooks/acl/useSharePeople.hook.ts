import { PermissionType } from "@/constants/permission-type";
import { useState } from "react";
import { useFindShareableUsers } from "../user/useFindShareableUsers.hook";
import { useShareFolder } from "./useShareFolder.hook";

export const useSharePeople = (folderId: string) => {
    const [permission, setPermission] =
        useState<PermissionType>(PermissionType.EDIT);

    const userSearch = useFindShareableUsers();
    const shareFolder = useShareFolder(folderId);

    const shareUser = () => {
        if (!userSearch.selectedUser) return;

        shareFolder.shareFolderMutation.mutate({
            targetUserId: userSearch.selectedUser.id,
            permission,
        }, {
            onSuccess: () => {
                userSearch.clearSelectedUser();
            },
        });
    };

    return {
        ...userSearch,
        permission,
        setPermission,
        shareUser,
        isSharing: shareFolder.isLoading,
    };
};