
"use client";

import { Button } from "@/components/ui/button";
import { EllipsisVertical, File } from "lucide-react";

interface FileItemProps {
    id: string;
    name: string;
}

export default function FileItem({
    id,
    name,
}: FileItemProps) {
    return (
        <div
            data-resource-id={id}
            className="aspect-square bg-border/35 p-3 rounded-lg flex flex-col gap-3"
        >
            <div className="flex justify-between items-center gap-3">
                <span className="truncate text-sm font-medium">
                    {name}
                </span>

                <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full shrink-0"
                >
                    <EllipsisVertical className="size-4" />
                </Button>
            </div>

            <div className="flex-1 flex items-center justify-center rounded-md bg-background/70">
                <File className="size-16 text-muted-foreground" />
            </div>
        </div>
    );
}
