import { folderService } from "@/services/folder/folder.service";
import { useQuery } from "@tanstack/react-query";

export function useGetTrashFolders() {
    const query = useQuery({
        queryKey: ["trash-folders"],
        queryFn: () => folderService.getTrashFolders(),
    });

    return {
        folders: query.data ?? [],
        isLoading: query.isLoading,
        isError: query.isError,
        error: query.error,
        refetch: query.refetch,
    };
}