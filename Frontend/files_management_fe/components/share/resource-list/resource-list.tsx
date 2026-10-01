"use client"
import { useViewModeStore } from "@/stores/view-mode.store";
import ResourceTable from "./table/resource-table";

export default function ResourceList() {

    const viewMode = useViewModeStore(
        (state) => state.viewMode
    );

    return (
        <div>
            {viewMode === "Grid" && (
                <div>Grid</div>
            )}

            {viewMode === "List" && (
                <ResourceTable resources={[]} />
            )}
        </div>
    )
}