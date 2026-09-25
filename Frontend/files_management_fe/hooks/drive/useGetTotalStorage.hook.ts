import { useQuery } from "@tanstack/react-query";
import { driveService } from "@/services/drive/drive.service";

export function useGetTotalStorage() {
    const query = useQuery({
        queryKey: ["total-storage"],
        queryFn: driveService.getTotalStorage,
    });

    return {
        storage: query.data,
        isLoading: query.isLoading,
        isError: query.isError,
        error: query.error,
        refetch: query.refetch,
    };
}