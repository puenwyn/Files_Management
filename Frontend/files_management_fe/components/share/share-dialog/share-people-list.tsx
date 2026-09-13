import { ACLUserListResponse, ACLUserResponse } from "@/schemas/acl/acl-user-response.schema";
import { SharePermission } from "@/types/share.type";
import { ShareUserItem } from "./share-user-item";
import { useGetFolderUsers } from "@/hooks/acl/useGetFolderUsers.hook";
import { useShareFolder } from "@/hooks/acl/useShareFolder.hook";
import { PermissionType } from "@/constants/permission-type";

interface SharePeopleListProps {
    folderId: string;
}

export function SharePeopleList({
    folderId,
}: SharePeopleListProps) {
    const {
        data: users = [],
        isLoading,
        isError,
    } = useGetFolderUsers(folderId);

    const { shareFolderMutation } = useShareFolder(folderId);
    const handlePermissionChange = (
        userId: string,
        permission: PermissionType,
    ) => {
        shareFolderMutation.mutate({
            targetUserId: userId,
            permission,
        });
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
                    />
                ))}
            </div>
        </section>
    );
}