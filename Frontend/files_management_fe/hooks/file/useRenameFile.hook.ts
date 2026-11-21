import { toast } from "@/components/ui/toast";
import { RenameFileRequest, renameFileRequestSchema } from "@/schemas/file/rename-file.schema";
import { fileService } from "@/services/file/file.service";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";

export function useRenameFile(
    fileId: string,
    driveId: string | null,
    parentFolderId: string | null,
    onSuccess?: () => void
) {
    const queryClient = useQueryClient();

    const form = useForm<RenameFileRequest>({
        resolver: zodResolver(renameFileRequestSchema),
        defaultValues: {
            newName: "",
        },
    });

    const renameFileMutation = useMutation({
        mutationFn: (data: RenameFileRequest) => fileService.renameFile(fileId, data),

        onSuccess: () => {
            if (parentFolderId) {
                queryClient.invalidateQueries({
                    queryKey: ["folder-files", parentFolderId],
                });
            } else {
                queryClient.invalidateQueries({
                    queryKey: ["drive-files", driveId],
                });
            }

            form.reset();
            onSuccess?.();

            toast.add({
                type: "success",
                description: "File renamed successfully!",
            });
        },

        onError: (error) => {
            toast.add({
                type: "error",
                description: error.message,
            });
        },
    });

    const onSubmit = form.handleSubmit((value) => {
        renameFileMutation.mutate(value);
    });

    return {
        form,
        onSubmit,
        isLoading: renameFileMutation.isPending,
        isError: renameFileMutation.isError,
        error: renameFileMutation.error,
        isSuccess: renameFileMutation.isSuccess,
    };
}