import { useQuery } from "@tanstack/react-query";
import { aclService } from "@/services/acl/acl.service";

export const useGetFileUsers = (fileId: string) => {
    return useQuery({
        queryKey: ["file-users", fileId],
        queryFn: () => aclService.getFileUsers(fileId),
        enabled: !!fileId,
    });
};