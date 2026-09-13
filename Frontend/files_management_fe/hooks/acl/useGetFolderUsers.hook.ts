import { useQuery } from "@tanstack/react-query";
import { aclService } from "@/services/acl/acl.service";

export const useGetFolderUsers = (folderId: string) => {
    return useQuery({
        queryKey: ["folder-users", folderId],
        queryFn: () => aclService.getFolderUsers(folderId),
        enabled: !!folderId,
    });
};