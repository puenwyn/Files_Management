import { toast } from "@/components/ui/toast";
import { folderService } from "@/services/folder/folder.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useDeleteFolder(
    folderId: string,
    driveId: string,
    parentFolderId: string | null
) {

    const queryClient = useQueryClient();

    const deleteFolderMutation = useMutation({
        mutationFn: () => folderService.deleteFolder(folderId),
        onSuccess: () => {
            if (parentFolderId) {
                queryClient.invalidateQueries({
                    queryKey: ["folder-children", parentFolderId],
                });
            } else {
                queryClient.invalidateQueries({
                    queryKey: ["drive-folders", driveId],
                });
            }

            toast.add({
                type: "success",
                description: "Folder deleted successfully!",
            });
        },
        onError: (error) => {
            console.log("Delete folder error:", error.message);
            toast.add({
                type: "error",
                description: error.message,
            });
        },
    });

    return {
        deleteFolderMutation,
        isLoading: deleteFolderMutation.isPending,
        isError: deleteFolderMutation.isError,
        error: deleteFolderMutation.error,
        isSuccess: deleteFolderMutation.isSuccess,
    };
}