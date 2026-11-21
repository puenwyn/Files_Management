
"use client";

import { useState } from "react";
import { useParams } from "next/navigation";

import FolderItem from "@/components/dashboard/home/list/gridview/folder-item";
import FileItem from "@/components/dashboard/home/list/gridview/file-item";

import { AppBreadcrumb } from "@/components/shared/breadcrumb/app-breadcrumb";
import AppContextMenu from "@/components/shared/contextmenu/app-context-menu";
import VerifyPasswordDialog from "@/components/shared/dialog/verify-password-dialog";
import CreateFolderDialog from "@/components/shared/dialog/create-dialog";

import { Button } from "@/components/ui/button";

import { useFindDrive } from "@/hooks/drive/useFindDrive.hook";
import { useGetDriveFolders } from "@/hooks/folder/useGetDriveFolders.hook";
import { useGetDriveFiles } from "@/hooks/file/useGetDriveFiles.hook";
import { useHideHidden } from "@/schemas/auth/useHideHidden.hook";
import { useContextMenu } from "@/hooks/action/useContextMenu.hook";

import StateView from "@/components/common/state-view/state-view";
import { stateViewData } from "@/components/common/state-view/state-view.data";
import ResourceToolbar from "@/components/share/resource-toolbar/resource-toolbar";

export default function DriveIdPage() {
    const params = useParams<{ driveId: string }>();
    const driveId = params.driveId;

    const [verifyPasswordOpen, setVerifyPasswordOpen] = useState(false);

    const {
        data,
        isLoading,
        isError,
        error,
    } = useFindDrive(driveId);

    const {
        data: folders = [],
        showHidden,
        isPending,
        isError: isFoldersError,
        error: foldersError,
        refetch,
    } = useGetDriveFolders(driveId);

    const {
        data: files = [],
        isLoading: isFilesLoading,
        isError: isFilesError,
        error: filesError,
    } = useGetDriveFiles(driveId);

    const {
        hideHidden,
        isLoading: isHideLoading,
    } = useHideHidden(() => {
        refetch();
    });

    const {
        items,
        createFolderOpen,
        setCreateFolderOpen,
    } = useContextMenu();

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (isError || !data) {
        return <div>{error?.message}</div>;
    }

    if (isFoldersError) {
        return <div>{foldersError?.message}</div>;
    }

    if (isFilesError) {
        return <div>{filesError?.message}</div>;
    }

    const isEmpty = folders.length === 0 && files.length === 0;

    return (
        <>
            <AppBreadcrumb
                items={[
                    { label: "Drive", href: "/drives" },
                    { label: data.driveName },
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
                {isPending || isFilesLoading ? (
                    <div>Loading resources...</div>
                ) : isEmpty ? (
                    <div className="h-full flex items-center justify-center">
                        <StateView {...stateViewData.emptyFolder} />
                    </div>
                ) : (
                    <div className="w-full flex flex-col gap-8">
                        {/* Folder Section */}
                        {folders.length > 0 && (
                            <section className="flex flex-col gap-4">
                                <h3 className="text-base font-semibold">
                                    Folders
                                </h3>

                                <div className="w-full grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4">
                                    {folders.map((item) => (
                                        <FolderItem
                                            key={`folder-${item.id}`}
                                            id={item.id}
                                            name={item.folderName}
                                            driveId={item.driveId ?? ""}
                                            parentFolderId={item.parentFolderId}
                                            isHidden={item.status !== "SHOW"}
                                            permissionType={item.permissionType ?? undefined}
                                        />
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* File Section */}
                        {files.length > 0 && (
                            <section className="flex flex-col gap-4">
                                <h3 className="text-base font-semibold">
                                    Files
                                </h3>

                                <div className="w-full grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4">
                                    {files.map((item) => (
                                        <FileItem
                                            key={`file-${item.id}`}
                                            id={item.id}
                                            name={item.name}
                                            extension={item.extension}
                                            driveId={item.driveId}
                                            parentFolderId={item.folderId}
                                            permissionType={item.permissionType}
                                        />
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>
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
        </>
    );
}
