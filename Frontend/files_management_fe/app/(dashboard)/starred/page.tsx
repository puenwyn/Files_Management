"use client"
import { ShareDialog } from "@/components/share/share-dialog/share-dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function StarredPage() {
    const [shareOpen, setShareOpen] = useState(false);

    return (
        <>
            <Button onClick={() => setShareOpen(true)}>
                Share
            </Button>

            <ShareDialog
                open={shareOpen}
                onOpenChange={setShareOpen}
                resourceId="test-folder-123"
                resourceName="My Folder"
                resourceType="folder"
            />
        </>
    )
}