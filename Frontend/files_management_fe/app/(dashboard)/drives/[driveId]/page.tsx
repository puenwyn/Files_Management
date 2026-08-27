"use client";

import FolderItem from "@/components/dashboard/home/list/gridview/folder-item";
import { AppBreadcrumb } from "@/components/shared/breadcrumb/app-breadcrumb";
import { useFindDrive } from "@/hooks/drive/useFindDrive.hook";
import { useGetDriveFolders } from "@/hooks/folder/useGetDriveFolders.hook";
import { useParams } from "next/navigation";

export default function DriveIdPage() {
    const params = useParams<{ driveId: string }>();
    const driveId = params.driveId;

    const {
        data,
        isLoading,
        isError,
        error,
    } = useFindDrive(driveId);

    const {
        data: folders,
        isPending,
        isError: isFoldersError,
        error: foldersError,
        refetch
    } = useGetDriveFolders(driveId);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (isError || !data) {
        return <div>{error?.message}</div>;
    }

    return (
        <div>
            <AppBreadcrumb
                items={[
                    {
                        label: "Drive",
                        href: "/drives",
                    },
                    {
                        label: data.driveName,
                    },
                ]}
            />
            <h1>{data?.id}</h1>
            <h1>{data?.driveName}</h1>
            <div className="
                                grid
                                grid-cols-2
                                md:grid-cols-3
                                xl:grid-cols-5
                                gap-4
                    ">
                {folders.map((item) => (
                    <FolderItem
                        key={item.id}
                        id={item.id}
                        name={item.folderName}
                    />
                ))}
                {/* <FolderItem
                            name="Tài liệu học tập"
                            items={13}
                        /> */}
            </div>
        </div>
    );
}