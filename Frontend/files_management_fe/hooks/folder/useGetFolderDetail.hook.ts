import { folderService } from "@/services/folder/folder.service";
import { useQuery } from "@tanstack/react-query";

export const useGetFolderDetail = (folderId: string) => {
    return useQuery({
        queryKey: ["folder-detail", folderId],
        queryFn: () => folderService.getFolderDetail(folderId),
        enabled: !!folderId,
    });
};