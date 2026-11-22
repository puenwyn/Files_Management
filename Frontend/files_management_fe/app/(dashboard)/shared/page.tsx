
"use client";

import PageTitle from "@/components/dashboard/layout/Title/page-title";
import ResourceList from "@/components/share/resource-list/resource-list";
import { ViewModeToggle } from "@/components/dashboard/common/app-view-mode";
import StateView from "@/components/common/state-view/state-view";
import { stateViewData } from "@/components/common/state-view/state-view.data";
import { useGetSharedFolders } from "@/hooks/acl/useGetSharedFolders.hook";
import { useGetSharedFiles } from "@/hooks/acl/useGetSharedFiles.hook";
import { ResourceType } from "@/types/resource.type";
import { ResourceTableResource } from "@/components/share/resource-list/table/resource-table-column";

export default function SharedPage() {
    const {
        data: sharedFolders = [],
        isLoading: isFoldersLoading,
        isError: isFoldersError,
        error: foldersError,
    } = useGetSharedFolders();

    const {
        data: sharedFiles = [],
        isLoading: isFilesLoading,
        isError: isFilesError,
        error: filesError,
    } = useGetSharedFiles();

    const resources: ResourceTableResource[] = [
        ...sharedFolders.map((folder) => ({
            id: folder.id,
            name: folder.folderName,
            type: ResourceType.FOLDER,
            driveId: folder.driveId,
            parentFolderId: folder.parentFolderId,
            permissionType: folder.permissionType,
            status: folder.status,
            owner: folder.owner.fullName,
            modifiedAt: String(folder.updatedAt),
            isStarred: folder.isStarred,
        })),

        ...sharedFiles.map((file) => ({
            id: file.id,
            name: file.name,
            type: ResourceType.FILE,
            driveId: file.driveId,
            parentFolderId: file.folderId,
            permissionType: file.permissionType,
            owner: file.owner.fullName,
            modifiedAt: String(file.updatedAt),
        })),
    ];

    const isLoading = isFoldersLoading || isFilesLoading;

    const isEmpty = sharedFolders.length === 0 && sharedFiles.length === 0;

    if (isFoldersError) {
        return <div>{foldersError?.message}</div>;
    }

    if (isFilesError) {
        return <div>{filesError?.message}</div>;
    }

    return (
        <main className="space-y-5">
            <div className="flex items-center justify-between">
                <PageTitle
                    title="Shared with me"
                    subTitle="Access folders and files shared with you by others"
                />

                <ViewModeToggle />
            </div>

            {isLoading ? (
                <ResourceList
                    resources={[]}
                    isLoading
                />
            ) : isEmpty ? (
                <div className="h-full flex items-center justify-center">
                    <StateView {...stateViewData.emptyFolder} />
                </div>
            ) : (
                <ResourceList
                    resources={resources}
                    isLoading={false}
                />
            )}
        </main>
    );
}
