import { useMutation, useQueryClient } from "@tanstack/react-query";
import { starredService } from "@/services/starred/starred.service";
import { ResourceType } from "@/types/resource.type";
import { toast } from "@/components/ui/toast";

export function useRemoveStarred(
    resourceId: string,
    resourceType: ResourceType,
) {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: () =>
            starredService.removeStarred(
                resourceId,
                resourceType
            ),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["starred"],
            });

            queryClient.invalidateQueries({
                queryKey: ["folder-children"],
            });

            queryClient.invalidateQueries({
                queryKey: ["drive-folders"],
            });
            toast.add({
                type: "success",
                description: "Add to starred successfully!"
            });
        },

        onError: (error) => {
            console.error("ADD ERROR:", error);
            toast.add({
                type: "error",
                description: error.message
            });
        },
    });

    return {
        removeStarredMutation: mutation,
        isLoading: mutation.isPending,
        isError: mutation.isError,
        error: mutation.error,
        isSuccess: mutation.isSuccess,
    };
}