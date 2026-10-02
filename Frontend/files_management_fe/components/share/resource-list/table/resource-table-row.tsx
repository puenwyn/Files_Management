"use client";

import AppDropdownMenu from "@/components/shared/dropdown-menu/app-dropdown-menu";
import { ShareDialog } from "@/components/share/share-dialog/share-dialog";
import RenameFolderDialog from "@/components/shared/dialog/rename-dialog";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { useResourceMenu } from "@/hooks/action/useResourceMenu";
import { cn } from "@/lib/utils";
import { ResourceType } from "@/types/resource.type";
import { EllipsisVertical } from "lucide-react";
import { useRouter } from "next/navigation";
import {
    ResourceTableColumn,
    ResourceTableResource,
} from "./resource-table-column";

interface ResourceTableRowProps {
    resource: ResourceTableResource;
    columns: ResourceTableColumn[];
}

export default function ResourceTableRow({
    resource,
    columns,
}: ResourceTableRowProps) {

    const router = useRouter();

    const {
        items,
        renameOpen,
        setRenameOpen,
        shareOpen,
        setShareOpen,
    } = useResourceMenu(
        resource.id,
        resource.type,
        resource.driveId ?? "",
        resource.parentFolderId,
        resource.permissionType,
        resource.isStarred
    );

    const canAccess = resource.isAccessed !== false;

    const handleDoubleClick = () => {
        if (!canAccess) return;

        if (resource.type === ResourceType.FOLDER) {
            router.push(`/files/${resource.id}`);
        }
    };

    return (
        <>
            <TableRow
                onDoubleClick={handleDoubleClick}
                className={cn(
                    canAccess
                        ? "cursor-pointer"
                        : "cursor-not-allowed opacity-50"
                )}
            >
                {columns.map((column) => (
                    <TableCell
                        key={column.key}
                        className={column.className}
                    >
                        {column.key === "actions" ? (
                            canAccess && (
                                <AppDropdownMenu items={items}>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="
                                            size-8
                                            rounded-full
                                            hover:bg-muted-foreground/5
                                            active:bg-muted-foreground/10
                                            cursor-pointer
                                        "
                                        onDoubleClick={(e) => {
                                            e.stopPropagation();
                                        }}
                                    >
                                        <EllipsisVertical className="size-4" />
                                    </Button>
                                </AppDropdownMenu>
                            )
                        ) : (
                            column.getValue(resource)
                        )}
                    </TableCell>
                ))}
            </TableRow>

            {resource.type === ResourceType.FOLDER && (
                <>
                    <RenameFolderDialog
                        folderId={resource.id}
                        driveId={resource.driveId ?? ""}
                        parentFolderId={resource.parentFolderId}
                        open={renameOpen}
                        onOpenChange={setRenameOpen}
                    />

                    <ShareDialog
                        open={shareOpen}
                        onOpenChange={setShareOpen}
                        resourceId={resource.id}
                        resourceName={resource.name}
                        resourceType="folder"
                    />
                </>
            )}
        </>
    );
}