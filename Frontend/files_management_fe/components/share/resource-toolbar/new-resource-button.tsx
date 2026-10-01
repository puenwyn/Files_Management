"use client";

import { useState } from "react";
import CreateFolderDialog from "@/components/shared/dialog/create-dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface NewResourceButtonProps {
    driveId: string | null;
    parentFolderId: string | null;
}

export default function NewResourceButton({
    driveId,
    parentFolderId,
}: NewResourceButtonProps) {
    const [open, setOpen] = useState(false);

    return (
        <>
            <Button onClick={() => setOpen(true)}>
                <Plus />
                New
            </Button>

            <CreateFolderDialog
                open={open}
                onOpenChange={setOpen}
                driveId={driveId}
                parentFolderId={parentFolderId}
            />
        </>
    );
}