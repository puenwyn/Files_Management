"use client";
import { Check, LoaderCircle, X, AlertCircle, File as FileIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatFileSize } from "@/utils/file.type";
import { UploadFile } from "@/types/file-upload.type";

interface UploadFileListProps {
    files: UploadFile[];
    onRemove: (label: string) => void;
}

export function UploadFileList({ files, onRemove }: UploadFileListProps) {
    if (files.length === 0) {
        return (
            <div className="flex min-h-[240px] items-center justify-center rounded-xl border border-dashed">
                <div className="text-center">
                    <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-xl bg-muted">
                        <FileIcon className="size-6 text-muted-foreground" />
                    </div>
                    <p className="text-sm font-medium">No files selected</p>
                    <p className="mt-1 text-xs text-muted-foreground">Choose files to upload</p>
                </div>
            </div>
        );
    }

    return (
        <div className="overflow-hidden rounded-xl border">
            <div className="divide-y">
                {files.map(item => (
                    <div key={item.metadata.label} className="flex items-center gap-3 px-4 py-3">
                        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                            <FileIcon className="size-5 text-muted-foreground" />
                        </div>

                        <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium">{item.file.name}</p>
                            <p className="text-xs text-muted-foreground">{formatFileSize(item.file.size)}</p>
                            {item.status === "error" && (
                                <p className="mt-1 text-xs text-destructive">{item.error}</p>
                            )}
                        </div>

                        {item.status === "pending" && (
                            <Button
                                variant="ghost"
                                size="icon"
                                className="size-8 shrink-0 rounded-full"
                                onClick={() => onRemove(item.metadata.label)}
                            >
                                <X className="size-4" />
                            </Button>
                        )}

                        {item.status === "uploading" && (
                            <LoaderCircle className="size-5 shrink-0 animate-spin text-primary" />
                        )}

                        {item.status === "success" && (
                            <Check className="size-5 shrink-0 text-green-500" />
                        )}

                        {item.status === "error" && (
                            <AlertCircle className="size-5 shrink-0 text-destructive" />
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}