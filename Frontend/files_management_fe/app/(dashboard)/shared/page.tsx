"use client"
import PageTitle from "@/components/dashboard/layout/Title/page-title";
import AppTableHeader from "@/components/shared/table/app-table-header";
import AppTableItem from "@/components/shared/table/app-table-item";
import { useGetSharedFolders } from "@/hooks/acl/useGetSharedFolders.hook";

export default function SharedPage() {

    const {
        data: sharedFolders = [],
        isPending,
        isError,
        error,
    } = useGetSharedFolders();

    return (
        <main className="space-y-5">
            <PageTitle
                title="Shared with me"
                subTitle="Access folders and files shared with you by others"
            />
            <div>
                <AppTableHeader />
                {sharedFolders.map((folder) => (
                    <AppTableItem
                        key={folder.id}
                        id={folder.folderId}
                        name={folder.folderName}
                        owner="Owner"
                        updatedAt="-"
                        size={folder.permissionType}
                    />
                ))}
            </div>
        </main>
    )
}