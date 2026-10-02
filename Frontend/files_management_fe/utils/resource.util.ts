import { ResourceType } from "@/types/resource.type";
import { ResourceTableResource } from "@/components/share/resource-list/table/resource-table-column";
import { FolderResponse } from "@/schemas/folder/folder-response.schema";

export function folderToResource(
    folder: FolderResponse & { isAccessed?: boolean }
): ResourceTableResource {
    return {
        id: folder.id,
        type: ResourceType.FOLDER,
        name: folder.folderName,
        driveId: folder.driveId,
        parentFolderId: folder.parentFolderId,
        permissionType: folder.permissionType,
        status: folder.status,
        isAccessed: folder.isAccessed,
        owner: folder.owner?.fullName ?? null,
        modifiedAt: folder.updatedAt.toISOString(),
        size: null,
    };
}