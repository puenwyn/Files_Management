import { toast } from "@/components/ui/toast";
import { fileService } from "@/services/file/file.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useRestoreFile = () => {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: (fileId: string) =>
            fileService.restoreFile(fileId),

        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["trash-files"] });

            toast.add({
                type: "success",
                description: "File restored successfully!",
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
        restoreFileMutation: mutation,
        isLoading: mutation.isPending,
        isError: mutation.isError,
        error: mutation.error,
        isSuccess: mutation.isSuccess,
    };
};