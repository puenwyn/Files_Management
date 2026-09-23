import { toast } from "@/components/ui/toast";
import { folderService } from "@/services/folder/folder.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useRestoreFolder = () => {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: (folderId: string) =>
            folderService.restoreFolder(folderId),

        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["trash-folders"] });
            toast.add({
                type: "success",
                description: "Folder restored successfully!",
            });
        },
        onError: (error) => {
            toast.add({
                type: "error",
                description: error.message,
            });
        }
    });

    return {
        restoreFolderMutation: mutation,
        isLoading: mutation.isPending,
        isError: mutation.isError,
        error: mutation.error,
        isSuccess: mutation.isSuccess,
    };
};