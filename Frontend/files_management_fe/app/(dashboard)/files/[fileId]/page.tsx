"use client"
import FolderItem from "@/components/dashboard/home/list/gridview/folder-item";
import { useGetDriveFolders } from "@/hooks/folder/useGetDriveFolders.hook";
import { useParams } from "next/navigation";

export default function FilesPage() {
    const params = useParams<{ fileId: string }>();
    const driveId = params.fileId;

    const {
        data,
        isPending,
        isError,
        error,
        refetch
    } = useGetDriveFolders(driveId);

    return (
        <div className="
                    grid
                    grid-cols-2
                    md:grid-cols-3
                    xl:grid-cols-5
                    gap-4
        ">
            Hi
            {data.map((item) => (
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
    );
}