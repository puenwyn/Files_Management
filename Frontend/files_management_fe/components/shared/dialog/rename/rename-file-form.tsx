import FormTextField from "@/components/dashboard/form/form-text-field";
import { useRenameFile } from "@/hooks/file/useRenameFile.hook";
import { useEffect } from "react";

interface RenameFileFormProps {
    fileId: string;
    currentName: string;
    driveId: string | null;
    parentFolderId: string | null;
    onSuccess: () => void
}

export default function RenameFileForm({
    fileId,
    currentName,
    driveId,
    parentFolderId,
    onSuccess
}: RenameFileFormProps) {
    const { form, onSubmit, isLoading } = useRenameFile(
        fileId,
        driveId,
        parentFolderId,
        onSuccess
    );

    useEffect(() => {
        form.reset({
            newName: currentName,
        });
    }, [currentName, form]);

    return (
        <form id="rename-resource-form" onSubmit={onSubmit}>
            <FormTextField
                control={form.control}
                name="newName"
                label="File name"
            />
        </form>
    );
}