"use client";

import { X, File as FileIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatFileSize } from "@/utils/file.type";

interface UploadFileListProps {
    files: File[];
    onRemove: (index: number) => void;
}

export function UploadFileList({
    files,
    onRemove,
}: UploadFileListProps) {
    if (files.length === 0) {
        return (
            <div className="flex min-h-[240px] items-center justify-center rounded-xl border border-dashed">
                <div className="text-center">
                    <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-xl bg-muted">
                        <FileIcon className="size-6 text-muted-foreground" />
                    </div>

                    <p className="text-sm font-medium">
                        No files selected
                    </p>

                    <p className="mt-1 text-xs text-muted-foreground">
                        Choose files to upload
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="overflow-hidden rounded-xl border">
            <div className="divide-y">
                {files.map((file, index) => (
                    <div
                        key={`${file.name}-${file.lastModified}-${index}`}
                        className="flex items-center gap-3 px-4 py-3"
                    >
                        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                            <FileIcon className="size-5 text-muted-foreground" />
                        </div>

                        <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium">
                                {file.name}
                            </p>

                            <p className="text-xs text-muted-foreground">
                                {formatFileSize(file.size)}
                            </p>
                        </div>

                        <Button
                            variant="ghost"
                            size="icon"
                            className="size-8 shrink-0 rounded-full"
                            onClick={() => onRemove(index)}
                        >
                            <X className="size-4" />
                        </Button>
                    </div>
                ))}
            </div>
        </div>
    );
}