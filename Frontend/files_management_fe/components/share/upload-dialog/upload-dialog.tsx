"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { UploadFooter } from "./upload-footer";
import { UploadFileList } from "./upload-file-list";
import { useUploadFiles } from "@/hooks/action/useUploadFile.hook";
import { UploadFilePicker } from "./upload-file-picker";

interface UploadDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    driveId: string | null;
    parentFolderId: string | null;
}

export function UploadDialog({
    open,
    onOpenChange,
    driveId,
    parentFolderId,
}: UploadDialogProps) {
    const {
        files,
        addFiles,
        removeFile,
        clearFiles,
    } = useUploadFiles();

    const handleCancel = () => {
        clearFiles();
        onOpenChange(false);
    };

    const handleUpload = async () => {
        const payload = {
            driveId,
            parentFolderId,
            files: await Promise.all(
                files.map(async (file) => {
                    const buffer = await file.arrayBuffer();

                    const hashBuffer = await crypto.subtle.digest(
                        "SHA-256",
                        buffer
                    );

                    const hashArray = Array.from(new Uint8Array(hashBuffer));

                    const sha256 = hashArray
                        .map((byte) => byte.toString(16).padStart(2, "0"))
                        .join("");

                    return {
                        label: crypto.randomUUID(),
                        name: file.name,
                        extension: file.name.split(".").pop() ?? "",
                        size: file.size,
                        mimeType: file.type,
                        sha256,
                    };
                })
            ),
        };

        console.log(JSON.stringify(payload, null, 2));
    };

    return (
        <Dialog
            open={open}
            onOpenChange={onOpenChange}
        >
            <DialogContent className="w-[700px] !max-w-[700px] gap-0 overflow-hidden rounded-2xl p-0">
                <DialogHeader className="border-b px-6 py-5">
                    <DialogTitle className="text-lg">
                        Upload files
                    </DialogTitle>

                    <p className="text-sm text-muted-foreground">
                        Select the files you want to upload.
                    </p>
                </DialogHeader>

                <div className="max-h-[60vh] overflow-y-auto px-6 py-5">
                    <UploadFilePicker
                        onFilesSelected={addFiles}
                    />

                    {files.length > 0 && (
                        <div className="mt-5">
                            <UploadFileList
                                files={files}
                                onRemove={removeFile}
                            />
                        </div>
                    )}
                </div>

                <UploadFooter
                    onCancel={handleCancel}
                    onUpload={handleUpload}
                    disabled={files.length === 0}
                />
            </DialogContent>
        </Dialog>
    );
}