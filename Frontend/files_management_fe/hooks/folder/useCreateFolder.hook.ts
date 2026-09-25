import { toast } from "@/components/ui/toast";
import { CreateFolderRequest, createFolderRequestSchema } from "@/schemas/folder/create-folder.schema";
import { folderService } from "@/services/folder/folder.service";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";

export function useCreateFolder(
    driveId: string | null,
    parentFolderId: string | null,
    onSuccess: () => void
) {
    const queryClient = useQueryClient();

    const form = useForm<CreateFolderRequest>({
        resolver: zodResolver(createFolderRequestSchema),
        defaultValues: {
            folderName: ""
        }
    });

    const createFolderMutation = useMutation({
        mutationFn: (data: CreateFolderRequest) => folderService.createFolder(data),
        onSuccess: () => {
            if (parentFolderId) {
                queryClient.invalidateQueries({ queryKey: ["folder-children", parentFolderId] });
            } else {
                queryClient.invalidateQueries({ queryKey: ["drive-folders", driveId] });
            }
            form.reset();
            onSuccess?.();
            toast.add({
                type: "success",
                description: "Folder created successfully!",
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
        const data: CreateFolderRequest = {
            folderName: value.folderName,
            ...(parentFolderId
                ? { parentFolderId }
                : { driveId: driveId! }),
        };
        console.log("FORM VALUE:", value);
        createFolderMutation.mutate(data);
    });

    return {
        form,
        onSubmit,
        isLoading: createFolderMutation.isPending,
        isError: createFolderMutation.isError,
        error: createFolderMutation.error,
        isSuccess: createFolderMutation.isSuccess,
    };
}