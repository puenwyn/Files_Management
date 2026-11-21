import FormTextField from "@/components/dashboard/form/form-text-field";
import { useRenameFolder } from "@/hooks/folder/useRenameFolder.hook";
import { useEffect } from "react";

interface RenameFolderFormProps {
    folderId: string;
    currentName: string;
    driveId: string | null;
    parentFolderId: string | null;
    onSuccess: () => void;
}

export default function RenameFolderForm({
    folderId,
    currentName,
    driveId,
    parentFolderId,
    onSuccess
}: RenameFolderFormProps) {
    const { form, onSubmit, isLoading } = useRenameFolder(
        folderId,
        driveId,
        parentFolderId,
        onSuccess
    );

    useEffect(() => {
        form.reset({
            newFolderName: currentName,
        });
    }, [currentName, form]);

    return (
        <form id="rename-resource-form" onSubmit={onSubmit}>
            <FormTextField
                control={form.control}
                name="newFolderName"
                label="Folder name"
            />
        </form>
    );
}