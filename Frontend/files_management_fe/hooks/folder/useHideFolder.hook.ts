import { toast } from "@/components/ui/toast";
import { HideFolderRequest, hideFolderRequestSchema } from "@/schemas/folder/hide-folder.schema";
import { folderService } from "@/services/folder/folder.service";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";

export function useHideFolder(
    folderId: string,
    driveId: string,
    parentFolderId: string | null,
    onSuccess?: () => void
) {
    const queryClient = useQueryClient();

    const form = useForm<HideFolderRequest>({
        resolver: zodResolver(hideFolderRequestSchema),
        defaultValues: {
            hashPassword: ""
        }
    });

    const hideFolderMutation = useMutation({
        mutationFn: (data: HideFolderRequest) => folderService.hideFolder(folderId, data),
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
                description: "Folder hided successfully!",
            });
        },
        onError: (error) => {
            console.log("Hide folder error:", error.message);
            toast.add({
                type: "error",
                description: error.message,
            });
        },
    });

    const onSubmit = form.handleSubmit((value) => {
        console.log("FORM VALUE:", value);
        hideFolderMutation.mutate(value);
    });

    return {
        form,
        onSubmit,
        isLoading: hideFolderMutation.isPending,
        isError: hideFolderMutation.isError,
        error: hideFolderMutation.error,
        isSuccess: hideFolderMutation.isSuccess,
    };
}