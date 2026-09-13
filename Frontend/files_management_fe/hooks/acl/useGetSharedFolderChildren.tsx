import { aclService } from "@/services/acl/acl.service";
import { useQuery } from "@tanstack/react-query";

export const useGetSharedFolderChildren = (folderId: string) => {
    return useQuery({
        queryKey: ["shared-folder-children", folderId],
        queryFn: () => aclService.getSharedFolderChildren(folderId),
        enabled: !!folderId,
    });
};