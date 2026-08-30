import { folderService } from "@/services/folder/folder.service";
import { useQuery } from "@tanstack/react-query";

export function useGetFolderChildren(folderId: string) {
    const query = useQuery({
        queryKey: ["folder-children", folderId],
        queryFn: () => folderService.getFolderChildrens(folderId),
        enabled: !!folderId,
    });

    return {
        data: query.data?.folders ?? [],
        showHidden: query.data?.showHidden,
        isPending: query.isPending,
        isError: query.isError,
        error: query.error,
        refetch: query.refetch,
    };
}