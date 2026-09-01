"use client"
import RenameFolderDialog from "@/components/shared/dialog/rename-dialog";
import AppDropdownMenu from "@/components/shared/dropdown-menu/app-dropdown-menu";
import { Button } from "@/components/ui/button";
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
    // onRename?: () => void;
    // onHide?: () => void;
    // onDelete?: () => void;
}

export default function FolderItem({
    id,
    name,
    driveId,
    parentFolderId,
    isHidden,
    // onRename,
    // onHide,
    // onDelete
}: FolderItemProps) {

    const router = useRouter();

    const {
        items,
        renameOpen,
        setRenameOpen,
    } = useFolderMenu(
        id,
        driveId,
        parentFolderId
    );

    return (
        <>
            <div
                onDoubleClick={() => router.push(`/files/${id}`)}
                className={cn(
                    "bg-border/35 hover:bg-border/75 p-3 rounded-lg cursor-pointer",
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
        </>
    )
}