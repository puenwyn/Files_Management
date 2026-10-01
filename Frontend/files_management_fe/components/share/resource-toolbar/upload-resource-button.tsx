"use client";

import { Button } from "@/components/ui/button";
import { formatFileSize } from "@/utils/file.type";
import { Upload } from "lucide-react";
import { useRef } from "react";

interface UploadResourceButtonProps {
    driveId: string | null;
    parentFolderId: string | null;
}

export default function UploadResourceButton({
    driveId,
    parentFolderId,
}: UploadResourceButtonProps) {
    const inputRef = useRef<HTMLInputElement>(null);

    const handleUploadClick = () => {
        inputRef.current?.click();
    };

    const handleFileChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const files = event.target.files;

        if (!files || files.length === 0) return;

        const file = files[0];

        console.log("Selected file:", file.name);
        console.log("Selected file:", formatFileSize(file.size));

        console.log("driveId:", driveId);
        console.log("parentFolderId:", parentFolderId);
    };

    return (
        <>
            <input
                ref={inputRef}
                type="file"
                className="hidden"
                onChange={handleFileChange}
            />
            <Button variant="outline" onClick={handleUploadClick}>
                <Upload />
                Upload
            </Button>
        </>
    );
}