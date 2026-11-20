import { fileService } from "@/services/file/file.service";
import { useQuery } from "@tanstack/react-query";

export const useGetFilePreview = (fileId: string) => {
    return useQuery({
        queryKey: ["file-preview", fileId],
        queryFn: () => fileService.getFilePreview(fileId),
        enabled: !!fileId,
    });
};