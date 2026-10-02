import { FolderResponse } from "@/schemas/folder/folder-response.schema";
import { Resource, ResourceType } from "@/types/resource.type";

export function folderToResource(
    folder: FolderResponse & { isAccessed?: boolean }
): Resource {
    return {
        id: folder.id,
        name: folder.folderName,
        type: ResourceType.FOLDER,
        driveId: folder.driveId,
        parentFolderId: folder.parentFolderId,
        permissionType: folder.permissionType,
        status: folder.status,
        isAccessed: folder.isAccessed,
    };
}