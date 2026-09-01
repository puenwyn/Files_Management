import { aclService } from "@/services/acl/acl.service";
import { useQuery } from "@tanstack/react-query";

export const useGetSharedFolders = () => {
    return useQuery({
        queryKey: ["shared-folders"],
        queryFn: () => aclService.getSharedFolders(),
    });
};