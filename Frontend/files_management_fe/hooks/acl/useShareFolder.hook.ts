import { useMutation, useQueryClient } from "@tanstack/react-query";
import { aclService } from "@/services/acl/acl.service";
import { ShareFolderRequest } from "@/schemas/acl/share-folder-request.schema";
import { toast } from "@/components/ui/toast";

export const useShareFolder = (folderId: string) => {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: (data: ShareFolderRequest) =>
            aclService.shareFolder(folderId, data),

        onSuccess: () => {
            toast.add({
                type: "success",
                description: "Permission updated successfully!",
            });

            queryClient.invalidateQueries({
                queryKey: ["folder-users", folderId],
            });
        },

        onError: (error) => {
            toast.add({
                type: "success",
                description: "Something went wrong!",
            });
        },
    });

    return {
        shareFolderMutation: mutation,
        isLoading: mutation.isPending,
        isSuccess: mutation.isSuccess,
        isError: mutation.isError,
        error: mutation.error,
    };
};