import { toast } from "@/components/ui/toast";
import { HideFolderRequest, hideFolderRequestSchema } from "@/schemas/folder/hide-folder.schema";
import { ShowFolderRequest, showFolderRequestSchema } from "@/schemas/folder/show-folder.schema";
import { folderService } from "@/services/folder/folder.service";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";

export function useShowFolder(
    folderId: string,
    driveId: string,
    parentFolderId: string | null,
    onSuccess?: () => void
) {
    const queryClient = useQueryClient();

    const form = useForm<ShowFolderRequest>({
        resolver: zodResolver(showFolderRequestSchema),
        defaultValues: {
            comparePassword: ""
        }
    });

    const showFolderMutation = useMutation({
        mutationFn: (data: ShowFolderRequest) => folderService.showFolder(folderId, data),
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
                description: "Folder showed successfully!",
            });
        },
        onError: (error) => {
            console.log("Show folder error:", error.message);
            toast.add({
                type: "error",
                description: error.message,
            });
        },
    });

    const onSubmit = form.handleSubmit((value) => {
        console.log("FORM VALUE:", value);
        showFolderMutation.mutate(value);
    });

    return {
        form,
        onSubmit,
        isLoading: showFolderMutation.isPending,
        isError: showFolderMutation.isError,
        error: showFolderMutation.error,
        isSuccess: showFolderMutation.isSuccess,
    };
}