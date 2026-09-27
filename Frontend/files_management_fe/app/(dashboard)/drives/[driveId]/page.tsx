"use client";

import { useState } from "react";
import { useParams } from "next/navigation";

import FolderItem from "@/components/dashboard/home/list/gridview/folder-item";
import { AppBreadcrumb } from "@/components/shared/breadcrumb/app-breadcrumb";
import AppContextMenu from "@/components/shared/contextmenu/app-context-menu";
import VerifyPasswordDialog from "@/components/shared/dialog/verify-password-dialog";
import { Button } from "@/components/ui/button";

import { bgroundMenuItems } from "@/constants/dashboard/menu";
import { useFindDrive } from "@/hooks/drive/useFindDrive.hook";
import { useGetDriveFolders } from "@/hooks/folder/useGetDriveFolders.hook";
import { useHideHidden } from "@/schemas/auth/useHideHidden.hook";
import CreateFolderDialog from "@/components/shared/dialog/create-dialog";
import { useContextMenu } from "@/hooks/action/useContextMenu.hook";
import { ActionType } from "@/constants/action-type";
import StateView from "@/components/common/state-view/state-view";
import { stateViewData } from "@/components/common/state-view/state-view.data";

export default function DriveIdPage() {
    const params = useParams<{ driveId: string }>();
    const driveId = params.driveId;

    const [verifyPasswordOpen, setVerifyPasswordOpen] = useState(false);

    const {
        data,
        isLoading,
        isError,
        error,
    } = useFindDrive(driveId);

    const {
        data: folders,
        showHidden,
        isPending,
        isError: isFoldersError,
        error: foldersError,
        refetch,
    } = useGetDriveFolders(driveId);

    const {
        hideHidden,
        isLoading: isHideLoading,
    } = useHideHidden(() => {
        refetch();
    });

    const {
        items,
        createFolderOpen,
        setCreateFolderOpen,
    } = useContextMenu();

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (isError || !data) {
        return <div>{error?.message}</div>;
    }

    return (
        <>
            <AppBreadcrumb
                items={[
                    { label: "Drive", href: "/drives" },
                    { label: data.driveName },
                ]}
            />

            <div className="flex items-center justify-between mb-4">
                <Button
                    variant="outline"
                    disabled={isHideLoading}
                    onClick={() => {
                        if (showHidden) {
                            hideHidden();
                        } else {
                            setVerifyPasswordOpen(true);
                        }
                    }}
                >
                    {showHidden ? "Hide hidden" : "Show hidden"}
                </Button>
            </div>
            <AppContextMenu items={items}>
                {folders.length === 0 ? (
                    <div className="h-full flex items-center justify-center">
                        <StateView {...stateViewData.emptyFolder} />
                    </div>
                ) : (
                    <div className="w-full grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4">
                        {folders.map((item) => (
                            <FolderItem
                                key={item.id}
                                id={item.id}
                                name={item.folderName}
                                driveId={item.driveId ?? ""}
                                parentFolderId={item.parentFolderId}
                                isHidden={item.status === "SHOW" ? false : true}
                                permissionType={item.permissionType ?? undefined}
                            />
                        ))}
                    </div>
                )}
            </AppContextMenu>

            <CreateFolderDialog
                open={createFolderOpen}
                onOpenChange={setCreateFolderOpen}
                driveId={driveId}
                parentFolderId={null}
            />

            <VerifyPasswordDialog
                open={verifyPasswordOpen}
                onOpenChange={setVerifyPasswordOpen}
                onSuccess={() => {
                    refetch();
                }}
            />
        </>
    );
}