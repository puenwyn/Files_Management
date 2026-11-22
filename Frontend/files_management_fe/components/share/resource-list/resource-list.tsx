"use client";

import FolderItemSkeleton from "@/components/dashboard/home/list/gridview/folder-item-skeleton";
import { useViewModeStore } from "@/stores/view-mode.store";
import ResourceGrid from "./grid/resource-grid";
import ResourceTable from "./table/resource-table";
import {
    defaultResourceTableColumns,
    ResourceTableColumn,
    ResourceTableResource,
} from "./table/resource-table-column";

interface ResourceListProps {
    resources: ResourceTableResource[];
    columns?: ResourceTableColumn[];
    isLoading?: boolean;
    isTrash?: boolean;
}

export default function ResourceList({
    resources,
    columns = defaultResourceTableColumns,
    isLoading = false,
    isTrash = false
}: ResourceListProps) {
    const viewMode = useViewModeStore(
        (state) => state.viewMode
    );

    console.log(viewMode);

    if (isLoading) {
        return (
            <div className="w-full">
                {viewMode === "Grid" && (
                    <div className="w-full flex-1 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                        {Array.from({ length: 10 }).map((_, index) => (
                            <FolderItemSkeleton key={index} />
                        ))}
                    </div>
                )}

                {viewMode === "List" && (
                    <ResourceTable
                        resources={[]}
                        columns={columns}
                    />
                )}
            </div>
        );
    }

    return (
        <div className="w-full">
            {viewMode === "Grid" && (
                <ResourceGrid data={resources} />
            )}

            {viewMode === "List" && (
                <ResourceTable
                    resources={resources}
                    columns={columns}
                    isTrash={isTrash}
                />
            )}
        </div>
    );
}