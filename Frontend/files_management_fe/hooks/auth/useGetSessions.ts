import { authService } from "@/services/auth/auth.service";
import { useQuery } from "@tanstack/react-query";

export function useGetSessions() {

    const query = useQuery({
        queryKey: ["auth", "devices"],
        queryFn: authService.getDevices,
    });

    return {
        devices: query.data ?? [],
        isPending: query.isPending,
        isError: query.isError,
        error: query.error,
        refetch: query.refetch,
    };
}