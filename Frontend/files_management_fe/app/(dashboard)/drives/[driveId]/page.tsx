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

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (isError || !data) {
        return <div>{error?.message}</div>;
    }

    return (
        <>
            <AppContextMenu items={bgroundMenuItems}>
                <div>
                    <AppBreadcrumb
                        items={[
                            {
                                label: "Drive",
                                href: "/drives",
                            },
                            {
                                label: data.driveName,
                            },
                        ]}
                    />

                    <div className="flex items-center justify-between mb-4">
                        <h1 className="text-xl font-semibold">
                            {data.driveName}
                        </h1>

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

                    <div
                        className="
                            grid
                            grid-cols-2
                            md:grid-cols-3
                            xl:grid-cols-5
                            gap-4
                        "
                    >
                        {folders.map((item) => (
                            <FolderItem
                                key={item.id}
                                id={item.id}
                                name={item.folderName}
                                driveId={item.driveId}
                                parentFolderId={item.parentFolderId}
                                isHidden={item.status === "SHOW" ? false : true}
                                permissionType={item.permissionType ?? undefined}
                            />
                        ))}
                    </div>
                </div>
            </AppContextMenu>

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