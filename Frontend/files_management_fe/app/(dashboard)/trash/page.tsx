"use client";

import StateView from "@/components/common/state-view/state-view";
import { stateViewData } from "@/components/common/state-view/state-view.data";
import PageTitle from "@/components/dashboard/layout/Title/page-title";
import { useGetTrashFolders } from "@/hooks/folder/useGetTrashFolders.hook";
import { useGetTrashFiles } from "@/hooks/file/useGetTrashFiles.hook";
import { ResourceType } from "@/types/resource.type";
import { ResourceTableResource } from "@/components/share/resource-list/table/resource-table-column";
import ResourceList from "@/components/share/resource-list/resource-list";
import ResourceTable from "@/components/share/resource-list/table/resource-table";

export default function TrashPage() {
    const { folders, isLoading: isLoadingFolders } = useGetTrashFolders();
    const { files, isLoading: isLoadingFiles } = useGetTrashFiles();

    const resources: ResourceTableResource[] = [
        ...folders.map((item) => ({
            id: item.id,
            name: item.folderName,
            type: ResourceType.FOLDER,
            driveId: item.driveId,
            parentFolderId: item.parentFolderId,
            owner: item.owner.fullName,
            modifiedAt: String(item.updatedAt),
        })),
        ...files.map((item) => ({
            id: item.id,
            name: item.name,
            type: ResourceType.FILE,
            driveId: item.driveId,
            parentFolderId: item.folderId,
            permissionType: item.permissionType,
            owner: item.owner.fullName,
            modifiedAt: String(item.updatedAt),
            size: item.size,
        })),
    ];

    const isLoading = isLoadingFolders || isLoadingFiles;

    return (
        <main className="min-h-full flex flex-col space-y-5">
            <PageTitle
                title="Trash"
                subTitle="View and manage files and folders that you have deleted"
            />

            {resources.length === 0 ? (
                <div className="h-full flex items-center justify-center">
                    <StateView {...stateViewData.emptyTrash} />
                </div>
            ) : (
                <ResourceTable
                    resources={resources}
                    isTrash
                />
            )}
        </main>
    );
}