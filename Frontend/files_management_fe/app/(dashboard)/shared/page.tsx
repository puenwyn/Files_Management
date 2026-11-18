"use client";

import { ViewModeToggle } from "@/components/dashboard/common/app-view-mode";
import AppGridView from "@/components/dashboard/common/view-mode/grid-view";
import AppListView from "@/components/dashboard/common/view-mode/list-view";

import FolderItem from "@/components/dashboard/home/list/gridview/folder-item";
import FileItem from "@/components/dashboard/home/list/gridview/file-item";

import PageTitle from "@/components/dashboard/layout/Title/page-title";
import AppTableItem from "@/components/shared/table/app-table-item";

import { useGetSharedFolders } from "@/hooks/acl/useGetSharedFolders.hook";
import { useGetSharedFiles } from "@/hooks/acl/useGetSharedFiles.hook";

import { useViewModeStore } from "@/stores/view-mode.store";

import StateView from "@/components/common/state-view/state-view";
import { stateViewData } from "@/components/common/state-view/state-view.data";

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

    const viewMode = useViewModeStore(
        (state) => state.viewMode
    );

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
                <div>Loading resources...</div>
            ) : isEmpty ? (
                <div className="h-full flex items-center justify-center">
                    <StateView {...stateViewData.emptyFolder} />
                </div>
            ) : (
                <div className="w-full flex flex-col gap-8">

                    {/* Shared Folder Section */}
                    {sharedFolders.length > 0 && (
                        <section className="flex flex-col gap-4">
                            <h3 className="text-base font-semibold">
                                Shared folders
                            </h3>

                            {viewMode === "Grid" ? (
                                <AppGridView>
                                    {sharedFolders.map((item) => (
                                        <FolderItem
                                            key={`folder-${item.id}`}
                                            id={item.id}
                                            name={item.folderName}
                                            driveId={item.driveId ?? ""}
                                            parentFolderId={item.parentFolderId}
                                            isHidden={item.status === "HIDDEN"}
                                            permissionType={item.permissionType}
                                        />
                                    ))}
                                </AppGridView>
                            ) : (
                                <AppListView>
                                    {sharedFolders.map((item) => (
                                        <AppTableItem
                                            key={`folder-${item.id}`}
                                            id={item.id}
                                            name={item.folderName}
                                            owner={item.owner.fullName}
                                            updatedAt={item.updatedAt.toDateString()}
                                            size="--"
                                        />
                                    ))}
                                </AppListView>
                            )}
                        </section>
                    )}

                    {/* Shared File Section */}
                    {sharedFiles.length > 0 && (
                        <section className="flex flex-col gap-4">
                            <h3 className="text-base font-semibold">
                                Shared files
                            </h3>

                            {viewMode === "Grid" ? (
                                <AppGridView>
                                    {sharedFiles.map((item) => (
                                        <FileItem
                                            key={`file-${item.id}`}
                                            id={item.id}
                                            name={item.name}
                                        />
                                    ))}
                                </AppGridView>
                            ) : (
                                <AppListView>
                                    {sharedFiles.map((item) => (
                                        <AppTableItem
                                            key={`file-${item.id}`}
                                            id={item.id}
                                            name={item.name}
                                            owner={item.owner.fullName}
                                            updatedAt={item.updatedAt.toDateString()}
                                            size="--"
                                        />
                                    ))}
                                </AppListView>
                            )}
                        </section>
                    )}
                </div>
            )}
        </main>
    );
}