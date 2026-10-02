"use client"
import StateView from "@/components/common/state-view/state-view";
import { stateViewData } from "@/components/common/state-view/state-view.data";
import FolderItem from "@/components/dashboard/home/list/gridview/folder-item";
import FolderItemSkeleton from "@/components/dashboard/home/list/gridview/folder-item-skeleton";
import ResourceGrid from "@/components/share/resource-list/grid/resource-grid";
import { AppBreadcrumb } from "@/components/shared/breadcrumb/app-breadcrumb";
import AppContextMenu from "@/components/shared/contextmenu/app-context-menu";
import CreateFolderDialog from "@/components/shared/dialog/create-dialog";
import { bgroundMenuItems } from "@/constants/dashboard/menu";
import { useContextMenu } from "@/hooks/action/useContextMenu.hook";
import { useFindDrive } from "@/hooks/drive/useFindDrive.hook";
import { useGetFolderChildren } from "@/hooks/folder/useGetFolderChildren.hook";
import { useGetFolderPath } from "@/hooks/folder/useGetFolderPath.hook";
import { folderToResource } from "@/utils/resource.util";
import { useParams } from "next/navigation";

export default function FilesPage() {
    const params = useParams<{ fileId: string }>();
    const folderId = params.fileId;

    const {
        data,
        permissionType,
        isPending,
        isFetching,
        isError,
        error,
        refetch
    } = useGetFolderChildren(folderId);

    const {
        data: folderPath,
        isPending: isPathPending,
    } = useGetFolderPath(folderId);

    const {
        items,
        createFolderOpen,
        setCreateFolderOpen,
    } = useContextMenu(permissionType);

    const { data: drive } = useFindDrive(
        folderPath?.driveId ?? ""
    );
    const folders = folderPath?.folders ?? [];
    const resources = data?.map(folderToResource) ?? [];

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
            ] : []),

        ...folders.map((folder, index) => ({
            label: folder.folderName,
            href:
                index === folders.length - 1 ? undefined : `/files/${folder.id}`,
        })),
    ];

    return (
        <main className="min-h-full flex flex-col space-y-5">
            <AppBreadcrumb items={breadcrumbItems} />
            <AppContextMenu items={items}>
                {isPending ? (
                    <div className="w-full flex-1 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                        {Array.from({ length: 10 }).map((_, index) => (
                            <FolderItemSkeleton key={index} />
                        ))}
                    </div>
                ) : data.length === 0 ? (
                    <div className="h-full flex items-center justify-center">
                        <StateView {...stateViewData.emptyFolder} />
                    </div>
                ) : (
                    <ResourceGrid data={resources} />
                )}
            </AppContextMenu>

            <CreateFolderDialog
                open={createFolderOpen}
                onOpenChange={setCreateFolderOpen}
                driveId={null}
                parentFolderId={folderId}
            />
        </main>
    );
}