"use client"
import StateView from "@/components/common/state-view/state-view";
import { stateViewData } from "@/components/common/state-view/state-view.data";
import { ViewModeToggle } from "@/components/dashboard/common/app-view-mode";
import PageTitle from "@/components/dashboard/layout/Title/page-title";
import ResourceList from "@/components/share/resource-list/resource-list";
import { starredResourceTableColumns } from "@/components/share/resource-list/table/resource-table-column";
import { useGetStarred } from "@/hooks/starred/useGetStarred.hook";
import { ResourceType } from "@/types/resource.type";

export default function StarredPage() {

    const { data, isPending, isError } = useGetStarred();
    const resources = data?.folders.map((folder) => ({
        id: folder.id,
        name: folder.folderName,
        type: ResourceType.FOLDER,
        owner: folder.owner.fullName,
        modifiedAt: folder.updatedAt.toLocaleDateString(),
        starredAt: folder.starredAt.toLocaleDateString(),
    })) ?? [];

    return (
        <main className="min-h-full flex flex-col space-y-5">
            <div className="flex items-center justify-between">
                <PageTitle
                    title="Starred"
                    subTitle="Your starred files and folders will appear here"
                />

                <ViewModeToggle />

            </div>
            {isError ? (
                <div className="h-full flex items-center justify-center">
                    <StateView {...stateViewData.notFound} />
                </div>
            ) : resources.length === 0 && !isPending ? (
                <div className="h-full flex items-center justify-center">
                    <StateView {...stateViewData.emptyStarred} />
                </div>
            ) : (
                <ResourceList
                    resources={resources}
                    columns={starredResourceTableColumns}
                    isLoading={isPending}
                />
            )}
        </main>
    )
}