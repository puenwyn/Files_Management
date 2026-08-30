import { folderService } from "@/services/folder/folder.service";
import { useQuery } from "@tanstack/react-query";

export function useGetDriveFolders(driveId: string) {
    const query = useQuery({
        queryKey: ["drive-folders", driveId], // 👈 PHẢI GIỐNG
        queryFn: () => {
            console.log("🔥 FETCH DRIVE FOLDERS:", driveId);

            return folderService.getDriveFolders(driveId);
        },
        enabled: !!driveId,
    });

    return {
        data: query.data?.folders ?? [],
        showHidden: query.data?.showHidden,
        isPending: query.isPending,
        isError: query.isError,
        error: query.error,
        refetch: query.refetch,
    };
}