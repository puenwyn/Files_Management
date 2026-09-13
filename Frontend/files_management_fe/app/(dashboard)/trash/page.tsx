"use client"
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
        <main className="space-y-5">
            <PageTitle
                title="My Profile"
                subTitle="View and manage files and folders that you have deleted"
            />
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

                {/* // <AppTableItem
                    //     id={item.id}
                    //     name={item.name}
                    //     owner={item.owner}
                    //     updatedAt={item.updatedAt}
                    //     size={item.size}
                    // /> */}
            </div>

        </main>
    )
}