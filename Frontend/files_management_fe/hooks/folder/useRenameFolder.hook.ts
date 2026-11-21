import { toast } from "@/components/ui/toast";
import { RenameFolderRequest, renameFolderRequestSchema } from "@/schemas/folder/rename-folder.schema";
import { folderService } from "@/services/folder/folder.service";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";

export function useRenameFolder(
    folderId: string,
    driveId: string | null,
    parentFolderId: string | null,
    onSuccess?: () => void
) {
    const queryClient = useQueryClient();

    const form = useForm<RenameFolderRequest>({
        resolver: zodResolver(renameFolderRequestSchema),
        defaultValues: {
            newFolderName: "",
        },
    });

    const renameFolderMutation = useMutation({
        mutationFn: (data: RenameFolderRequest) =>
            folderService.renameFolder(folderId, data),

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

            form.reset();
            onSuccess?.();

            toast.add({
                type: "success",
                description: "Folder renamed successfully!",
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
        console.log("FORM VALUE:", value);
        renameFolderMutation.mutate(value);
    });

    return {
        form,
        onSubmit,
        isLoading: renameFolderMutation.isPending,
        isError: renameFolderMutation.isError,
        error: renameFolderMutation.error,
        isSuccess: renameFolderMutation.isSuccess,
    };
}