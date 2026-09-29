"use client";

import { List, LayoutGrid } from "lucide-react";
import { useViewModeStore } from "@/stores/view-mode.store";
import { cn } from "@/lib/utils";

export function ViewModeToggle() {
    const view = useViewModeStore((state) => state.viewMode);
    const setView = useViewModeStore((state) => state.setViewMode);

    return (
        <div className="relative flex rounded-lg overflow-hidden border-2 border-border p-0.5">
            <div
                className={cn(
                    "absolute top-0.5 bottom-0.5 left-0.5 w-[calc(50%-2px)] rounded-md",
                    "bg-primary/20 transition-transform duration-200 ease-in-out",
                    view === "Grid" ? "translate-x-full" : "translate-x-0"
                )}
            />

            <button
                type="button"
                onClick={() => setView("List")}
                className={cn(
                    "relative z-10 px-3 py-2 cursor-pointer rounded-md",
                    "transition-colors duration-200",
                    view === "List"
                        ? "text-primary"
                        : "text-muted-foreground"
                )}
            >
                <List className="size-5" />
            </button>

            <button
                type="button"
                onClick={() => setView("Grid")}
                className={cn(
                    "relative z-10 px-3 py-2 cursor-pointer rounded-md",
                    "transition-colors duration-200",
                    view === "Grid"
                        ? "text-primary"
                        : "text-muted-foreground"
                )}
            >
                <LayoutGrid className="size-5" />
            </button>
        </div>
    );
}