import { create } from "zustand";
import { persist } from "zustand/middleware";

type ViewMode = "List" | "Grid";

interface ViewModeStore {
    viewMode: ViewMode;
    setViewMode: (mode: ViewMode) => void;
}

export const useViewModeStore = create<ViewModeStore>()(
    persist(
        (set) => ({
            viewMode: "Grid",
            setViewMode: (mode) => {
                set({ viewMode: mode });
            }
        }),
        {
            name: "files_management_view_mode"
        }
    )
);