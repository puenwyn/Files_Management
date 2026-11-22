import { toast } from "@/components/ui/toast";
import { fileService } from "@/services/file/file.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useDeleteFile(
    fileId: string,
    driveId: string | null,
    parentFolderId: string | null
) {
    const queryClient = useQueryClient();

    const deleteFileMutation = useMutation({
        mutationFn: () => fileService.deleteFile(fileId),

        onSuccess: () => {
            console.log("DELETE FILE:", {
                fileId,
                driveId,
                parentFolderId,
            });

            if (parentFolderId) {
                queryClient.invalidateQueries({
                    queryKey: ["folder-files", parentFolderId],
                });
            } else {
                queryClient.invalidateQueries({
                    queryKey: ["drive-files", driveId],
                });
            }

            toast.add({
                type: "success",
                description: "File deleted successfully!",
            });
        },
        onError: (error) => {
            toast.add({
                type: "error",
                description: error.message,
            });
        },
    });

    return {
        deleteFileMutation,
        isLoading: deleteFileMutation.isPending,
        isError: deleteFileMutation.isError,
        error: deleteFileMutation.error,
        isSuccess: deleteFileMutation.isSuccess,
    };
}