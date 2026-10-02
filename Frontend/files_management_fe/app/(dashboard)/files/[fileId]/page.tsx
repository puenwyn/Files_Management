"use client"
import StateView from "@/components/common/state-view/state-view";
import { stateViewData } from "@/components/common/state-view/state-view.data";
import FolderItemSkeleton from "@/components/dashboard/home/list/gridview/folder-item-skeleton";
import ResourceList from "@/components/share/resource-list/resource-list";
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
                {data.length === 0 && !isPending ? (
                    <div className="h-full flex items-center justify-center">
                        <StateView {...stateViewData.emptyFolder} />
                    </div>
                ) : (
                    <ResourceList
                        resources={resources}
                        isLoading={isPending}
                    />
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