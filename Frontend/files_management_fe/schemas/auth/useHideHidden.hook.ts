import { toast } from "@/components/ui/toast";
import { authService } from "@/services/auth/auth.service";
import { useMutation } from "@tanstack/react-query";

export function useHideHidden(
    onSuccess?: () => void
) {
    const hideHiddenMutation = useMutation({
        mutationFn: authService.hideHidden,

        onSuccess: () => {
            onSuccess?.();

            toast.add({
                type: "success",
                description: "Hidden folders hidden successfully!",
            });
        },

        onError: (error) => {
            console.log("Hide hidden folders error:", error.message);

            toast.add({
                type: "error",
                description: error.message,
            });
        },
    });

    return {
        hideHidden: hideHiddenMutation.mutate,
        isLoading: hideHiddenMutation.isPending,
        isError: hideHiddenMutation.isError,
        error: hideHiddenMutation.error,
        isSuccess: hideHiddenMutation.isSuccess,
    };
}