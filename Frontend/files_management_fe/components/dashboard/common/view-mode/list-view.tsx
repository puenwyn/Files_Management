import AppTableHeader from "@/components/shared/table/app-table-header";
import AppTableItem from "@/components/shared/table/app-table-item";
import { useGetTrashFolders } from "@/hooks/folder/useGetTrashFolders.hook";
import { FolderListResponse } from "@/schemas/folder/folder-response.schema";

interface AppListViewProps {
    children: React.ReactNode
}

export default function AppListView({
    children
}: AppListViewProps) {

    return (
        <div className="bg-card">
            <AppTableHeader />
            {children}
        </div>
    )
}