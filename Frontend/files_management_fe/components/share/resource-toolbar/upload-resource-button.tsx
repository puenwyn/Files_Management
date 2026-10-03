"use client";

import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { useState } from "react";
import { UploadDialog } from "../upload-dialog/upload-dialog";

interface UploadResourceButtonProps {
    driveId: string | null;
    parentFolderId: string | null;
}

export default function UploadResourceButton({
    driveId,
    parentFolderId,
}: UploadResourceButtonProps) {
    const [open, setOpen] = useState(false);

    return (
        <>
            <Button
                variant="outline"
                onClick={() => setOpen(true)}
            >
                <Upload />
                Upload
            </Button>

            <UploadDialog
                open={open}
                onOpenChange={setOpen}
                driveId={driveId}
                parentFolderId={parentFolderId}
            />
        </>
    );
}