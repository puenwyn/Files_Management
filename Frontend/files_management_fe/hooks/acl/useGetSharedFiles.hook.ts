import { aclService } from "@/services/acl/acl.service";
import { useQuery } from "@tanstack/react-query";

export const useGetSharedFiles = () => {
    return useQuery({
        queryKey: ["shared-files"],
        queryFn: () => aclService.getSharedFiles(),
    });
};