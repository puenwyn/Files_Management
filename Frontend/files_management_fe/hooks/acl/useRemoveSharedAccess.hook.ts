import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ResourceType } from "@/types/resource.type";
import { aclService } from "@/services/acl/acl.service";
import { toast } from "@/components/ui/toast";

export const useRemoveSharedAccess = (
    resourceId: string,
    resourceType: ResourceType,
) => {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: (targetUserId: string) =>
            resourceType === ResourceType.FOLDER
                ? aclService.removeFolderAccess(resourceId, targetUserId)
                : aclService.removeFileAccess(resourceId, targetUserId),

        onSuccess: () => {
            toast.add({
                type: "success",
                description: "Access removed successfully!",
            });

            queryClient.invalidateQueries({
                queryKey: [
                    resourceType === ResourceType.FOLDER ? "folder-users" : "file-users",
                    resourceId,
                ],
            });
        },

        onError: (error) => {
            toast.add({
                type: "error",
                description: error.message || "Something went wrong!",
            });
        },
    });

    return {
        removeSharedAccessMutation: mutation,
        isLoading: mutation.isPending,
        isSuccess: mutation.isSuccess,
        isError: mutation.isError,
        error: mutation.error,
    };
};