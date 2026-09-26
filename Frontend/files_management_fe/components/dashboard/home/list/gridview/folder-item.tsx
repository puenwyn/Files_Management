"use client"
import { ShareDialog } from "@/components/share/share-dialog/share-dialog";
import RenameFolderDialog from "@/components/shared/dialog/rename-dialog";
import AppDropdownMenu from "@/components/shared/dropdown-menu/app-dropdown-menu";
import { Button } from "@/components/ui/button";
import { PermissionType } from "@/constants/permission-type";
import { useFolderMenu } from "@/hooks/action/useFolderMenu.hook";
import { cn } from "@/lib/utils";
import { EllipsisVertical } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface FolderItemProps {
    id: string;
    name: string;
    driveId: string;
    parentFolderId: string | null;
    isHidden: boolean;
    permissionType?: PermissionType | null
    canAccess?: boolean
}

export default function FolderItem({
    id,
    name,
    driveId,
    parentFolderId,
    isHidden,
    permissionType,
    canAccess
}: FolderItemProps) {

    const router = useRouter();

    const {
        items,
        renameOpen,
        setRenameOpen,
        shareOpen,
        setShareOpen,
    } = useFolderMenu(
        id,
        driveId,
        parentFolderId,
        permissionType
    );

    return (
        <>
            <div
                onDoubleClick={() => {
                    if (canAccess === false) return;
                    router.push(`/files/${id}`)
                }}
                className={cn(
                    "bg-border/35 hover:bg-border/75 p-3 rounded-lg cursor-pointer",
                    canAccess === false
                        ? "cursor-not-allowed opacity-50"
                        : "cursor-pointer hover:bg-border/75",
                    isHidden ? "bg-card/50 text-foreground/50" : "bg-card text-foreground"
                )}
            >
                <div className="flex justify-between">
                    <Image
                        src="/icons/azure-folder-blank.svg"
                        alt=""
                        width={30}
                        height={30}
                    />
                    {canAccess !== false && (
                        <AppDropdownMenu items={items}>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="
                                    rounded-full
                                    hover:bg-muted-foreground/5
                                    active:bg-muted-foreground/10
                                    cursor-pointer
                                "
                            >
                                <EllipsisVertical className="size-4" />
                            </Button>
                        </AppDropdownMenu>
                    )}

                </div>
                <span className="font-medium">{name}</span>
                <br />
            </div>

            <RenameFolderDialog
                folderId={id}
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
                resourceType="folder"
            />
        </>
    )
}