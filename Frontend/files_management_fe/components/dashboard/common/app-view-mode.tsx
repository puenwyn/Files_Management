"use client";

import { List, LayoutGrid } from "lucide-react";
import { useViewModeStore } from "@/stores/view-mode.store";

export function ViewModeToggle() {
    const view = useViewModeStore((state) => state.viewMode);
    const setView = useViewModeStore((state) => state.setViewMode);

    return (
        <div className="flex rounded-lg overflow-hidden border-2 border-border">
            <div
                onClick={() => setView("List")}
                className={`px-3 py-2 cursor-pointer rounded-md
                    ${view === "List"
                        ? "bg-primary/20 text-primary"
                        : "bg-transparent"
                    }
                `}
            >
                <List className="size-5" />
            </div>

            <div
                onClick={() => setView("Grid")}
                className={`px-3 py-2 cursor-pointer rounded-md
                    ${view === "Grid"
                        ? "bg-primary/20 text-primary"
                        : "bg-transparent"
                    }
                `}
            >
                <LayoutGrid className="size-5" />
            </div>
        </div>
    );
}