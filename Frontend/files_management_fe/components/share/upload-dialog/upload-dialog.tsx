
"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { UploadFooter } from "./upload-footer";
import { UploadFileList } from "./upload-file-list";
import { UploadFilePicker } from "./upload-file-picker";
import { useUploadFiles } from "@/hooks/file/useUploadFile.hook";

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
        upload,
        isPreparing,
        isLoading,
    } = useUploadFiles({ driveId, parentFolderId });

    console.log("UploadDialog open:", open);

    const handleCancel = () => {
        if (isLoading || isPreparing) return;

        clearFiles();
        onOpenChange(false);
    };

    const handleOpenChange = (isOpen: boolean) => {
        if (!isOpen && (isLoading || isPreparing)) return;

        if (!isOpen) clearFiles();
        onOpenChange(isOpen);
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
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
                    <UploadFilePicker onFilesSelected={addFiles} />

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
                    onUpload={upload}
                    disabled={files.length === 0 || isPreparing || isLoading}
                    isLoading={isLoading}
                />
            </DialogContent>
        </Dialog>
    );
}
