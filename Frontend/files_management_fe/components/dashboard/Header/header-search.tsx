"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function HeaderSearch() {
    return (
        <div className="relative w-full max-w-md bg-border/35 rounded-lg">
            <Search
                className="
                    absolute left-3 top-1/2
                    size-4 -translate-y-1/2
                    text-muted-foreground
                "
            />

            <Input
                type="search"
                placeholder="Search files, folders..."
                className="
                    h-10
                    rounded-lg
                    bg-muted/40
                    pl-9
                    pr-4
                    border-transparent
                    focus-visible:bg-background
                "
            />
        </div>
    );
}