import { folderService } from "@/services/folder/folder.service";
import { useQuery } from "@tanstack/react-query";

export function useGetDriveFolders(driveId: string) {
    const query = useQuery({
        queryKey: ["folders", driveId],
        queryFn: () => folderService.getDriveFolders(driveId),
        enabled: !!driveId,
    });

    return {
        data: query.data ?? [],
        isPending: query.isPending,
        isError: query.isError,
        error: query.error,
        refetch: query.refetch,
    };
}