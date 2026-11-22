"use client"; import { ShareDialog } from "@/components/share/share-dialog/share-dialog";
import { useResourceDialogStore } from "@/stores/resource-dialog.store";
import RenameResourceDialog from "./rename/rename-dialog";

export default function ResourceDialogs() {
    const {
        resource,
        renameOpen,
        shareOpen,
        closeDialogs,
    } = useResourceDialogStore();

    if (!resource) return null;

    return (
        <>
            <RenameResourceDialog
                resourceId={resource.id}
                resourceType={resource.type}
                currentName={resource.name}
                extension={resource.extension}
                driveId={resource.driveId}
                parentFolderId={resource.parentFolderId}
                open={renameOpen}
                onOpenChange={(open) => {
                    if (!open) closeDialogs();
                }}
            />

            <ShareDialog
                open={shareOpen}
                onOpenChange={(open) => {
                    if (!open) closeDialogs();
                }}
                resourceId={resource.id}
                resourceName={resource.name}
                resourceType={resource.type}
            />
        </>
    );
}