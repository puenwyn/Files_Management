"use client";

import { useRef } from "react";
import { Upload } from "lucide-react";

interface UploadFilePickerProps {
    onFilesSelected: (files: File[]) => void;
}

export function UploadFilePicker({
    onFilesSelected,
}: UploadFilePickerProps) {
    const inputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const files = Array.from(event.target.files ?? []);

        if (files.length > 0) {
            onFilesSelected(files);
        }

        event.target.value = "";
    };

    return (
        <div
            onClick={() => inputRef.current?.click()}
            className="flex min-h-[180px] cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed hover:bg-muted/50"
        >
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                <Upload className="h-5 w-5" />
            </div>

            <p className="text-sm font-medium">
                Click to select files
            </p>

            <p className="mt-1 text-xs text-muted-foreground">
                You can select multiple files
            </p>

            <input
                ref={inputRef}
                type="file"
                multiple
                hidden
                onChange={handleFileChange}
            />
        </div>
    );
}