import AppDialog from "@/components/dashboard/common/app-dialog";
import FormTextField from "@/components/dashboard/form/form-text-field";
import { Button } from "@/components/ui/button";
import { useCreateFolder } from "@/hooks/folder/useCreateFolder.hook";

interface CreateFolderDialogProps {
    driveId: string | null;
    parentFolderId: string | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function CreateFolderDialog({
    parentFolderId,
    driveId,
    open,
    onOpenChange
}: CreateFolderDialogProps) {

    const { form, onSubmit, isLoading } = useCreateFolder(
        driveId,
        parentFolderId,
        () => {
            form.reset();
            onOpenChange(false);
        }
    );
    const { control } = form;

    return (
        <AppDialog
            open={open}
            onOpenChange={onOpenChange}
            title="Create folder"
            footer={
                <>
                    <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>

                    <Button type="submit" form="create-folder-form" disabled={isLoading}>
                        {isLoading ? "Renaming..." : "OK"}
                    </Button>
                </>
            }
        >
            <form id="create-folder-form" onSubmit={onSubmit}>
                <FormTextField
                    control={control}
                    name="folderName"
                    label="Folder name"
                />
            </form>
        </AppDialog>
    )
}