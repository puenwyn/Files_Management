
import { fileService } from "@/services/file/file.service";
import { useQuery } from "@tanstack/react-query";

export const useGetFolderFiles = (folderId: string) => {
    return useQuery({
        queryKey: ["folder-files", folderId],
        queryFn: () => fileService.getFolderFiles(folderId),
        enabled: !!folderId,
    });
};
