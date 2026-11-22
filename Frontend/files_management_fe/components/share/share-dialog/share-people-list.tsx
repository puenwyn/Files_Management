import { ACLUserListResponse, ACLUserResponse } from "@/schemas/acl/acl-user-response.schema";
import { SharePermission } from "@/types/share.type";
import { ShareUserItem } from "./share-user-item";
import { useGetFolderUsers } from "@/hooks/acl/useGetFolderUsers.hook";
import { useShareFolder } from "@/hooks/acl/useShareFolder.hook";
import { PermissionType } from "@/constants/permission-type";
import { ResourceType } from "@/types/resource.type";
import { useGetFileUsers } from "@/hooks/acl/useGetFileUsers.hook";
import { useShareFile } from "@/hooks/acl/useShareFile.hook";
import { useRemoveSharedAccess } from "@/hooks/acl/useRemoveSharedAccess.hook";

interface SharePeopleListProps {
    resourceId: string;
    resourceType: ResourceType
}

export function SharePeopleList({
    resourceId,
    resourceType
}: SharePeopleListProps) {
    const isFolder = resourceType === ResourceType.FOLDER;

    const folderUsers = useGetFolderUsers(isFolder ? resourceId : "");
    const fileUsers = useGetFileUsers(isFolder ? "" : resourceId);

    const users = isFolder ? folderUsers.data ?? [] : fileUsers.data ?? [];
    const isLoading = isFolder ? folderUsers.isLoading : fileUsers.isLoading;
    const isError = isFolder ? folderUsers.isError : fileUsers.isError;

    const shareFolder = useShareFolder(resourceId);
    const shareFile = useShareFile(resourceId);

    const removeAccess = useRemoveSharedAccess(resourceId, resourceType);

    const handlePermissionChange = (
        userId: string,
        permission: PermissionType,
    ) => {
        const mutation = isFolder ? shareFolder.shareFolderMutation : shareFile.shareFileMutation;
        mutation.mutate({
            targetUserId: userId,
            permission,
        });
    };

    console.log("THIS IS FILE USERS: ", fileUsers);

    const handleRemoveAccess = (userId: string) => {
        removeAccess.removeSharedAccessMutation.mutate(userId);
    };

    return (
        <section className="mt-7">
            <h3 className="mb-3 text-sm font-semibold">
                People with access
            </h3>

            <div className="divide-y rounded-xl border">
                {users.map((user) => (
                    <ShareUserItem
                        key={user.id}
                        user={user}
                        onPermissionChange={handlePermissionChange}
                        onRemove={handleRemoveAccess}
                        isRemoving={removeAccess.isLoading}
                    />
                ))}
            </div>
        </section>
    );
}