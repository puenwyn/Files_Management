
import { fileService } from "@/services/file/file.service";
import { useQuery } from "@tanstack/react-query";

export const useGetDriveFiles = (driveId: string) => {
    return useQuery({
        queryKey: ["drive-files", driveId],
        queryFn: () => fileService.getDriveFiles(driveId),
        enabled: !!driveId,
    });
};
