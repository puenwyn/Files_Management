import { toast } from "@/components/ui/toast";
import { starredService } from "@/services/starred/starred.service";
import { ResourceType } from "@/types/resource.type";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useAddStarred(
    resourceId: string,
    resourceType: ResourceType,
) {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: async () => {
            console.log("MUTATION ADD:", {
                resourceId,
                resourceType,
            });

            return starredService.addStarred(
                resourceId,
                resourceType
            );
        },

        onSuccess: (data) => {
            console.log("ADD SUCCESS:", data);

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
        addStarredMutation: mutation,
        isLoading: mutation.isPending,
        isError: mutation.isError,
        error: mutation.error,
        isSuccess: mutation.isSuccess,
    };
}