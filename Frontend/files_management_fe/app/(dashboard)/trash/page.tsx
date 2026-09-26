"use client"
import StateView from "@/components/common/state-view/state-view";
import { stateViewData } from "@/components/common/state-view/state-view.data";
import PageTitle from "@/components/dashboard/layout/Title/page-title";
import AppTableHeader from "@/components/shared/table/app-table-header";
import AppTableItem from "@/components/shared/table/app-table-item";
import { useGetTrashFolders } from "@/hooks/folder/useGetTrashFolders.hook";

export default function TrashPage() {

    const {
        folders,
        isLoading,
        isError,
        error,
        refetch
    } = useGetTrashFolders();

    return (
        <main className="min-h-full flex flex-col space-y-5">
            <PageTitle
                title="Trash"
                subTitle="View and manage files and folders that you have deleted"
            />
            {folders.length === 0 ? (
                <div className="h-full flex items-center justify-center">
                    <StateView {...stateViewData.emptyTrash} />
                </div>
            ) : (
                <div className="bg-card">
                    <AppTableHeader />
                    {folders.map((item) => (
                        <AppTableItem
                            id={item.id}
                            name={item.folderName}
                            owner={item.owner.fullName}
                            updatedAt={item.updatedAt.toDateString()}
                            size={"--"}
                        />
                    ))}
                </div>
            )}
        </main>
    )
}