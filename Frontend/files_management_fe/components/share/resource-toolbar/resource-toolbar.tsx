"use client";

import { useResourceDetailStore } from "@/stores/resource-detail.store";
import NewResourceButton from "./new-resource-button";
import UploadResourceButton from "./upload-resource-button";
import AppIconButton from "@/components/dashboard/iconbutton/app-icon-button";
import { Eye, Info } from "lucide-react";

interface ResourceToolbarProps {
    driveId: string | null;
    parentFolderId: string | null;
}

export default function ResourceToolbar({
    driveId,
    parentFolderId,
}: ResourceToolbarProps) {

    const isOpen = useResourceDetailStore((state) => state.isOpen);
    const togglePanel = useResourceDetailStore((state) => state.togglePanel);

    return (
        <div className="flex items-center gap-2">

            <AppIconButton icon={Eye} active={isOpen} onClick={togglePanel} />

            <NewResourceButton
                driveId={driveId}
                parentFolderId={parentFolderId}
            />

            <UploadResourceButton
                driveId={driveId}
                parentFolderId={parentFolderId}
            />
            
            <AppIconButton icon={Info} active={isOpen} onClick={togglePanel} />
        </div>
    );
}