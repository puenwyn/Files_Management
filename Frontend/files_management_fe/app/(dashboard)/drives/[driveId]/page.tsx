
"use client";

import { useState } from "react";
import { useParams } from "next/navigation";

import { Button } from "@/components/ui/button";

import StateView from "@/components/common/state-view/state-view";
import { stateViewData } from "@/components/common/state-view/state-view.data";

import { AppBreadcrumb } from "@/components/shared/breadcrumb/app-breadcrumb";
import AppContextMenu from "@/components/shared/contextmenu/app-context-menu";
import VerifyPasswordDialog from "@/components/shared/dialog/verify-password-dialog";
import CreateFolderDialog from "@/components/shared/dialog/create-dialog";

import PageTitle from "@/components/dashboard/layout/Title/page-title";
import ResourceToolbar from "@/components/share/resource-toolbar/resource-toolbar";
import ResourceList from "@/components/share/resource-list/resource-list";

import { ResourceType } from "@/types/resource.type";
import { ResourceTableResource } from "@/components/share/resource-list/table/resource-table-column";

import { useFindDrive } from "@/hooks/drive/useFindDrive.hook";
import { useGetDriveFolders } from "@/hooks/folder/useGetDriveFolders.hook";
import { useGetDriveFiles } from "@/hooks/file/useGetDriveFiles.hook";
import { useHideHidden } from "@/schemas/auth/useHideHidden.hook";
import { useContextMenu } from "@/hooks/action/useContextMenu.hook";

export default function DriveIdPage() {
    const params = useParams<{ driveId: string }>();
    const driveId = params.driveId;

    const [verifyPasswordOpen, setVerifyPasswordOpen] = useState(false);

    // Drive
    const {
        data: drive,
        isLoading: isDriveLoading,
        isError: isDriveError,
        error: driveError,
    } = useFindDrive(driveId);

    // Folders
    const {
        data: folders = [],
        showHidden,
        isPending: isFoldersLoading,
        isError: isFoldersError,
        error: foldersError,
        refetch,
    } = useGetDriveFolders(driveId);

    // Files
    const {
        data: files = [],
        isLoading: isFilesLoading,
        isError: isFilesError,
        error: filesError,
    } = useGetDriveFiles(driveId);

    // Hide hidden folders
    const {
        hideHidden,
        isLoading: isHideLoading,
    } = useHideHidden(() => {
        refetch();
    });

    // Context menu
    const {
        items,
        createFolderOpen,
        setCreateFolderOpen,
    } = useContextMenu();

    // Loading
    if (isDriveLoading) {
        return <div>Loading...</div>;
    }

    // Error
    if (isDriveError || !drive) {
        return <div>{driveError?.message}</div>;
    }

    if (isFoldersError) {
        return <div>{foldersError?.message}</div>;
    }

    if (isFilesError) {
        return <div>{filesError?.message}</div>;
    }

    // Normalize folders and files into ResourceTableResource[]
    const resources: ResourceTableResource[] = [
        ...folders.map((folder) => ({
            id: folder.id,
            name: folder.folderName,
            type: ResourceType.FOLDER,
            driveId: folder.driveId,
            parentFolderId: folder.parentFolderId,
            permissionType: folder.permissionType,
            status: folder.status,
            isStarred: folder.isStarred,
            owner: folder.owner?.fullName ?? null,
            modifiedAt: folder.updatedAt.toISOString(),
        })),

        ...files.map((file) => ({
            id: file.id,
            name: file.name,
            type: ResourceType.FILE,
            driveId: file.driveId,
            parentFolderId: file.folderId,
            permissionType: file.permissionType,
            owner: file.owner?.fullName ?? null,
            modifiedAt: file.updatedAt,
            size: file.size,
        })),
    ];

    const isLoading = isFoldersLoading || isFilesLoading;
    const isEmpty = folders.length === 0 && files.length === 0;

    return (
        <main className="min-h-full flex flex-col">
            <AppBreadcrumb
                items={[
                    { label: "Drive", href: "/drives" },
                    { label: drive.driveName },
                ]}
            />

            <div className="flex items-center justify-between mb-4">
                <Button
                    variant="outline"
                    disabled={isHideLoading}
                    onClick={() => {
                        if (showHidden) {
                            hideHidden();
                        } else {
                            setVerifyPasswordOpen(true);
                        }
                    }}
                >
                    {showHidden ? "Hide hidden" : "Show hidden"}
                </Button>

                <ResourceToolbar
                    driveId={driveId}
                    parentFolderId={null}
                />
            </div>

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
                    />
                )}
            </AppContextMenu>

            <CreateFolderDialog
                open={createFolderOpen}
                onOpenChange={setCreateFolderOpen}
                driveId={driveId}
                parentFolderId={null}
            />

            <VerifyPasswordDialog
                open={verifyPasswordOpen}
                onOpenChange={setVerifyPasswordOpen}
                onSuccess={() => {
                    refetch();
                }}
            />
        </main>
    );
}
