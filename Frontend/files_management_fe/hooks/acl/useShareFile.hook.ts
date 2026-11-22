
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { aclService } from "@/services/acl/acl.service";
import { toast } from "@/components/ui/toast";
import { ShareFileRequest } from "@/schemas/acl/share-file.schema";

export const useShareFile = (fileId: string) => {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: (data: ShareFileRequest) =>
            aclService.shareFile(fileId, data),

        onSuccess: () => {
            toast.add({
                type: "success",
                description: "Permission updated successfully!",
            });

            queryClient.invalidateQueries({
                queryKey: ["file-users", fileId],
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
        shareFileMutation: mutation,
        isLoading: mutation.isPending,
        isSuccess: mutation.isSuccess,
        isError: mutation.isError,
        error: mutation.error,
    };
};
