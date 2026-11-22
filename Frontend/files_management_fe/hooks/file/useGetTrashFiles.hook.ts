import { fileService } from "@/services/file/file.service";
import { useQuery } from "@tanstack/react-query";

export function useGetTrashFiles() {
    const query = useQuery({
        queryKey: ["trash-files"],
        queryFn: () => fileService.getTrashFiles(),
    });

    return {
        files: query.data ?? [],
        isLoading: query.isLoading,
        isError: query.isError,
        error: query.error,
        refetch: query.refetch,
    };
}