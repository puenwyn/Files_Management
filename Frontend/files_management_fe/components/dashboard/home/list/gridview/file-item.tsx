
"use client";

import { Button } from "@/components/ui/button";
import AppDropdownMenu from "@/components/shared/dropdown-menu/app-dropdown-menu";
import { ShareDialog } from "@/components/share/share-dialog/share-dialog";

import { PermissionType } from "@/constants/permission-type";
import { ResourceType } from "@/types/resource.type";

import { useResourceMenu } from "@/hooks/action/useResourceMenu";
import { useResourceDetailStore } from "@/stores/resource-detail.store";

import { EllipsisVertical, File } from "lucide-react";

interface FileItemProps {
    id: string;
    name: string;
    driveId: string;
    parentFolderId: string | null;
    permissionType?: PermissionType | null;
    isStarred?: boolean;
}

export default function FileItem({
    id,
    name,
    driveId,
    parentFolderId,
    permissionType,
    isStarred = false,
}: FileItemProps) {
    const openResource = useResourceDetailStore(
        (state) => state.openResource
    );

    const {
        items,
        renameOpen,
        setRenameOpen,
        shareOpen,
        setShareOpen,
    } = useResourceMenu(
        id,
        ResourceType.FILE,
        driveId,
        parentFolderId,
        permissionType,
        isStarred
    );

    const handleSelectFile = () => {
        openResource(id, ResourceType.FILE);
    };

    return (
        <>
            <div
                data-resource-id={id}
                onClick={handleSelectFile}
                className="
                    aspect-square
                    bg-border/35
                    hover:bg-border/75
                    p-3
                    rounded-lg
                    flex flex-col
                    gap-3
                    cursor-pointer
                    transition-colors
                "
            >
                <div className="flex justify-between items-center gap-3">
                    <div className="flex items-center gap-2 min-w-0">
                        <File className="size-5 shrink-0 text-muted-foreground" />

                        <span className="truncate text-sm font-medium">
                            {name}
                        </span>
                    </div>

                    <AppDropdownMenu items={items}>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="
                                rounded-full
                                shrink-0
                                hover:bg-muted-foreground/5
                                active:bg-muted-foreground/10
                                cursor-pointer
                            "
                            onClick={(e) => e.stopPropagation()}
                        >
                            <EllipsisVertical className="size-4" />
                        </Button>
                    </AppDropdownMenu>
                </div>

                <div className="
                    flex-1
                    flex items-center justify-center
                    rounded-md
                    bg-background/70
                ">
                    <File className="size-16 text-muted-foreground" />
                </div>
            </div>

            {/* <RenameFileDialog
                fileId={id}
                driveId={driveId}
                parentFolderId={parentFolderId}
                open={renameOpen}
                onOpenChange={setRenameOpen}
            />

            <ShareDialog
                open={shareOpen}
                onOpenChange={setShareOpen}
                resourceId={id}
                resourceName={name}
                resourceType="file"
            /> */}
        </>
    );
}
