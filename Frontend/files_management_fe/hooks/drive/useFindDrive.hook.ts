"use client";

import { useQuery } from "@tanstack/react-query";
import { driveService } from "@/services/drive/drive.service";

export function useFindDrive(driveId: string) {
    const findDriveQuery = useQuery({
        queryKey: ["drive", driveId],
        queryFn: () => driveService.findDriveById(driveId),
        enabled: !!driveId,
    });

    return {
        data: findDriveQuery.data,
        isLoading: findDriveQuery.isLoading,
        isError: findDriveQuery.isError,
        error: findDriveQuery.error,
        isSuccess: findDriveQuery.isSuccess,
    };
}