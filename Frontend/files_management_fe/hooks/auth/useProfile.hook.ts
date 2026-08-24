"use client";

import { authService } from "@/services/auth/auth.service";
import { useQuery } from "@tanstack/react-query";

export function useProfile() {
    const profileQuery = useQuery({
        queryKey: ["profile"],
        queryFn: authService.getProfile,
    });

    return {
        profile: profileQuery.data,
        isLoading: profileQuery.isLoading,
        isError: profileQuery.isError,
        error: profileQuery.error,
        isSuccess: profileQuery.isSuccess,
        refetch: profileQuery.refetch,
    };
}