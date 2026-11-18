
"use client";

import StateView from "@/components/common/state-view/state-view";
import { stateViewData } from "@/components/common/state-view/state-view.data";
import FileItem from "@/components/dashboard/home/list/gridview/file-item";
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

import { folderToResource } from "@/utils/resource.util";
import { useParams } from "next/navigation";

export default function FilesPage() {
    const params = useParams<{ fileId: string }>();
    const folderId = params.fileId;

    // Lấy folder con
    const {
        data: folders = [],
        permissionType,
        isPending: isFoldersPending,
        isError: isFoldersError,
        error: foldersError,
    } = useGetFolderChildren(folderId);

    // Lấy file trực tiếp trong folder hiện tại
    const {
        data: files = [],
        isLoading: isFilesLoading,
        isError: isFilesError,
        error: filesError,
    } = useGetFolderFiles(folderId);

    // Breadcrumb
    const {
        data: folderPath,
        isPending: isPathPending,
    } = useGetFolderPath(folderId);

    const { data: drive } = useFindDrive(
        folderPath?.driveId ?? ""
    );

    const {
        items,
        createFolderOpen,
        setCreateFolderOpen,
    } = useContextMenu(permissionType);

    const resources = folders.map(folderToResource);

    const breadcrumbItems = [
        {
            label: folderPath?.isShared ? "Share" : "Drive",
            href: folderPath?.isShared ? "/shared" : "/drives",
        },
        ...(!folderPath?.isShared && drive
            ? [{
                label: drive.driveName,
                href: `/drives/${drive.id}`,
            }]
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

    const isLoading = isFoldersPending || isFilesLoading;
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

                                <ResourceList
                                    resources={resources}
                                    isLoading={false}
                                />
                            </section>
                        )}

                        {/* File Section */}
                        {files.length > 0 && (
                            <section className="flex flex-col gap-4">
                                <h3 className="text-base font-semibold">
                                    Files
                                </h3>

                                <div className="w-full grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4">
                                    {files.map((file) => (
                                        <FileItem
                                            key={`file-${file.id}`}
                                            id={file.id}
                                            name={file.name}
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
                driveId={folderPath?.driveId ?? null}
                parentFolderId={folderId}
            />
        </main>
    );
}
