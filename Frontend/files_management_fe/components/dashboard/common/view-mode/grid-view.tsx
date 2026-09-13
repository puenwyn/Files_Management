import { useGetTrashFolders } from "@/hooks/folder/useGetTrashFolders.hook";
import FolderItem from "../../home/list/gridview/folder-item";
import { FolderListResponse } from "@/schemas/folder/folder-response.schema";

interface AppGridViewProps {
    children: React.ReactNode
}

export default function AppGridView({
    children
}: AppGridViewProps) {

    return (
        <div className="
            grid grid-cols-2
            md:grid-cols-3 xl:grid-cols-5 gap-4
        ">
            {children}
        </div>
    )
}