
import { PermissionType } from "@/constants/permission-type";
import { ResourceType } from "@/types/resource.type";
import { useState } from "react";
import { useFindShareableUsers } from "../user/useFindShareableUsers.hook";
import { useShareFolder } from "./useShareFolder.hook";
import { useShareFile } from "./useShareFile.hook";

export const useSharePeople = (
    resourceId: string,
    resourceType: ResourceType,
) => {
    const [permission, setPermission] = useState<PermissionType>(PermissionType.EDIT);

    const userSearch = useFindShareableUsers();

    const shareFolder = useShareFolder(resourceId);
    const shareFile = useShareFile(resourceId);

    const isFolder = resourceType === ResourceType.FOLDER;

    const shareUser = () => {
        if (!userSearch.selectedUser) return;

        const data = {
            targetUserId: userSearch.selectedUser.id,
            permission,
        };

        const mutation = isFolder ? shareFolder.shareFolderMutation : shareFile.shareFileMutation;

        mutation.mutate(data, {
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
        isSharing: isFolder ? shareFolder.isLoading : shareFile.isLoading,
    };
};
