"use client"
import FolderItem from "@/components/dashboard/home/list/gridview/folder-item";
import { AppBreadcrumb } from "@/components/shared/breadcrumb/app-breadcrumb";
import AppContextMenu from "@/components/shared/contextmenu/app-context-menu";
import { toolMenuItems } from "@/constants/dashboard/menu";
import { useFindDrive } from "@/hooks/drive/useFindDrive.hook";
import { useGetFolderChildren } from "@/hooks/folder/useGetFolderChildren.hook";
import { useGetFolderPath } from "@/hooks/folder/useGetFolderPath.hook";
import { useParams } from "next/navigation";

export default function FilesPage() {
    const params = useParams<{ fileId: string }>();
    const folderId = params.fileId;

    const {
        data,
        isPending,
        isError,
        error,
        refetch
    } = useGetFolderChildren(folderId);

    const {
        data: folderPath,
        isPending: isPathPending,
    } = useGetFolderPath(folderId);

    const { data: drive } = useFindDrive(
        folderPath?.driveId ?? ""
    );

    const folders = folderPath?.folders ?? [];

    const breadcrumbItems = [
        {
            label: "Drive",
            href: "/drives",
        },
        ...(drive
            ? [
                {
                    label: drive.driveName,
                    href: `/drives/${drive.id}`,
                },
            ]
            : []),
        ...folders.map((folder, index) => ({
            label: folder.folderName,
            href:
                index === folders.length - 1
                    ? undefined
                    : `/files/${folder.id}`,
        })),
    ];

    return (
        <main className="space-y-5">
            <AppBreadcrumb items={breadcrumbItems} />
            <AppContextMenu items={toolMenuItems}>
                <div className="w-full flex-1 grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
                    {data.map((item) => (
                        <FolderItem
                            key={item.id}
                            id={item.id}
                            name={item.folderName}
                            driveId={item.driveId}
                            parentFolderId={item.parentFolderId}
                            isHidden={item.status === "SHOW" ? false : true}
                        />
                    ))}
                    {/* <FolderItem
                name="Tài liệu học tập"
                items={13}
            /> */}
                </div>
            </AppContextMenu>
        </main>
    );
}