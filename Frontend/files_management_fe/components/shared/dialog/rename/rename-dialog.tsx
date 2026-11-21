"use client";

import AppDialog from "@/components/dashboard/common/app-dialog";
import { Button } from "@/components/ui/button";
import { ResourceType } from "@/types/resource.type";
import { useState } from "react";
import RenameFolderForm from "./renam-folder-form";
import RenameFileForm from "./rename-file-form";

interface RenameResourceDialogProps {
    resourceId: string;
    resourceType: ResourceType;
    currentName: string;
    extension?: string;
    driveId: string | null;
    parentFolderId: string | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function RenameResourceDialog({
    resourceId,
    resourceType,
    currentName,
    extension,
    driveId,
    parentFolderId,
    open,
    onOpenChange,
}: RenameResourceDialogProps) {
    const isFolder = resourceType === ResourceType.FOLDER;
    const [isLoading, setIsLoading] = useState(false);

    return (
        <AppDialog
            open={open}
            onOpenChange={onOpenChange}
            title={isFolder ? "Rename folder" : "Rename file"}
            footer={
                <>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                    >
                        Cancel
                    </Button>

                    <Button
                        type="submit"
                        form="rename-resource-form"
                        disabled={isLoading}

                    >
                        {isLoading ? "Renaming..." : "OK"}
                    </Button>
                </>
            }
        >
            {isFolder ? (
                <RenameFolderForm
                    folderId={resourceId}
                    currentName={currentName}
                    driveId={driveId}
                    parentFolderId={parentFolderId}
                    onSuccess={() => onOpenChange(false)}
                />
            ) : (
                <RenameFileForm
                    fileId={resourceId}
                    currentName={currentName}
                    driveId={driveId}
                    parentFolderId={parentFolderId}
                    onSuccess={() => onOpenChange(false)}
                />
            )}
        </AppDialog>
    );
}