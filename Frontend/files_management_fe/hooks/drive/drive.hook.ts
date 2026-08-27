import { driveService } from "@/services/drive/drive.service";
import { useQuery } from "@tanstack/react-query";

export function useGetDrives() {

    const query = useQuery({
        queryKey: ["auth", "drives"],
        queryFn: driveService.getDrives,
    });

    return {
        drives: query.data ?? [],
        isPending: query.isPending,
        isError: query.isError,
        error: query.error,
        refetch: query.refetch,
    };
}