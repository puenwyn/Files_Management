"use client"
import { ViewModeToggle } from "@/components/dashboard/common/app-view-mode";
import AppGridView from "@/components/dashboard/common/view-mode/grid-view";
import AppListView from "@/components/dashboard/common/view-mode/list-view";
import FolderItem from "@/components/dashboard/home/list/gridview/folder-item";
import PageTitle from "@/components/dashboard/layout/Title/page-title";
import AppTableHeader from "@/components/shared/table/app-table-header";
import AppTableItem from "@/components/shared/table/app-table-item";
import { useGetSharedFolders } from "@/hooks/acl/useGetSharedFolders.hook";
import { useGetDriveFolders } from "@/hooks/folder/useGetDriveFolders.hook";
import { useGetTrashFolders } from "@/hooks/folder/useGetTrashFolders.hook";
import { useViewModeStore } from "@/stores/view-mode.store";

export default function SharedPage() {

    const {
        data: sharedFolders = [],
    } = useGetSharedFolders();

    const viewMode = useViewModeStore(
        (state) => state.viewMode
    );

    return (
        <main className="space-y-5">
            <div className="flex items-center justify-between">
                <PageTitle
                    title="Shared with me"
                    subTitle="Access folders and files shared with you by others"
                />

                <ViewModeToggle />

            </div>
            {viewMode === "Grid" ? (
                <AppGridView>
                    {sharedFolders.map((item) => (
                        <FolderItem
                            key={item.id}
                            id={item.id}
                            name={item.folderName}
                            driveId={item.driveId}
                            parentFolderId={item.parentFolderId}
                            isHidden={item.status === "HIDDEN"}
                        />
                    ))}
                </AppGridView>
            ) : (
                <AppListView>
                    {sharedFolders.map((item) => (
                        <AppTableItem
                            id={item.id}
                            name={item.folderName}
                            owner={item.owner.fullName}
                            updatedAt={item.updatedAt.toDateString()}
                            size={"--"}
                        />
                    ))}
                </AppListView>
            )}
        </main>
    )
}