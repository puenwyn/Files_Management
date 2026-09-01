import { useQuery } from "@tanstack/react-query";
import { folderService } from "@/services/folder/folder.service";

export function useGetFolderPath(folderId: string) {
    return useQuery({
        queryKey: ["folder-path", folderId],
        queryFn: () => folderService.getFolderPath(folderId),
        enabled: !!folderId,
    });
}