"use client";

import StateView from "@/components/common/state-view/state-view";
import { stateViewData } from "@/components/common/state-view/state-view.data";
import ResourceList from "@/components/share/resource-list/resource-list";
import ResourceToolbar from "@/components/share/resource-toolbar/resource-toolbar";
import { AppBreadcrumb } from "@/components/shared/breadcrumb/app-breadcrumb";
import AppContextMenu from "@/components/shared/contextmenu/app-context-menu";
import CreateFolderDialog from "@/components/shared/dialog/create-dialog";

import { useContextMenu } from "@/hooks/action/useContextMenu.hook";
import { useFindDrive } from "@/hooks/drive/useFindDrive.hook";
import { useGetFolderChildren } from "@/hooks/folder/useGetFolderChildren.hook";
import { useGetFolderPath } from "@/hooks/folder/useGetFolderPath.hook";
import { useGetFolderFiles } from "@/hooks/file/useGetFolderFiles.hook";

import { ResourceType } from "@/types/resource.type";
import { folderToResource } from "@/utils/resource.util";

import { useParams } from "next/navigation";
import { ResourceTableResource } from "@/components/share/resource-list/table/resource-table-column";

export default function FilesPage() {
    const params = useParams<{ fileId: string }>();
    const folderId = params.fileId;

    // ==================== FOLDER CHILDREN ====================

    const {
        data: folders = [],
        permissionType,
        isPending: isFoldersPending,
        isError: isFoldersError,
        error: foldersError,
    } = useGetFolderChildren(folderId);

    // ==================== FOLDER FILES ====================

    const {
        data: files = [],
        isLoading: isFilesLoading,
        isError: isFilesError,
        error: filesError,
    } = useGetFolderFiles(folderId);

    // ==================== BREADCRUMB ====================

    const {
        data: folderPath,
        isPending: isPathPending,
    } = useGetFolderPath(folderId);

    const { data: drive } = useFindDrive(
        folderPath?.driveId ?? ""
    );

    // ==================== CONTEXT MENU ====================

    const {
        items,
        createFolderOpen,
        setCreateFolderOpen,
    } = useContextMenu(permissionType);

    const resources: ResourceTableResource[] = [
        ...folders.map((folder) => ({
            ...folderToResource(folder),
            type: ResourceType.FOLDER,
            owner: folder.owner.fullName,
            modifiedAt: String(folder.updatedAt),
        })),

        ...files.map((file) => ({
            id: file.id,
            name: file.name,
            type: ResourceType.FILE,
            driveId: file.driveId,
            parentFolderId: file.folderId,
            permissionType: file.permissionType,
            isAccessed: file.isAccessed,
            owner: file.owner.fullName,
            modifiedAt: String(file.updatedAt),
            size: file.size,
        })),
    ];

    const breadcrumbItems = [
        {
            label: folderPath?.isShared ? "Share" : "Drive",
            href: folderPath?.isShared ? "/shared" : "/drives",
        },

        ...(!folderPath?.isShared && drive
            ? [
                {
                    label: drive.driveName,
                    href: `/drives/${drive.id}`,
                },
            ]
            : []),

        ...(folderPath?.folders ?? []).map((folder, index, arr) => ({
            label: folder.folderName,
            href:
                index === arr.length - 1
                    ? undefined
                    : `/files/${folder.id}`,
        })),
    ];

    if (isFoldersError) {
        return <div>{foldersError?.message}</div>;
    }

    if (isFilesError) {
        return <div>{filesError?.message}</div>;
    }

    const isLoading =
        isFoldersPending ||
        isFilesLoading ||
        isPathPending;

    const isEmpty = folders.length === 0 && files.length === 0;

    return (
        <main className="min-h-full flex flex-col space-y-5">
            <AppBreadcrumb items={breadcrumbItems} />

            <ResourceToolbar
                driveId={folderPath?.driveId ?? null}
                parentFolderId={folderId}
            />

            <AppContextMenu items={items}>
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
            </AppContextMenu>

            <CreateFolderDialog
                open={createFolderOpen}
                onOpenChange={setCreateFolderOpen}
                driveId={folderPath?.driveId ?? null}
                parentFolderId={folderId}
            />
        </main>
    );
}