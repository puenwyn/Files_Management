import { fileService } from "@/services/file/file.service";
import { useQuery } from "@tanstack/react-query";

export const useGetFileDetail = (fileId: string) => {
    return useQuery({
        queryKey: ["file-detail", fileId],
        queryFn: () => fileService.getFileDetail(fileId),
        enabled: !!fileId,
    });
};