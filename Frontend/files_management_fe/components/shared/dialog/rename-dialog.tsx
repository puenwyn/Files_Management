import AppDialog from "@/components/dashboard/common/app-dialog";
import FormTextField from "@/components/dashboard/form/form-text-field";
import { Button } from "@/components/ui/button";
import { useRenameFolder } from "@/hooks/folder/useRenameFolder.hook";

interface RenameFolderDialogProps {
    folderId: string;
    driveId: string;
    parentFolderId: string | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function RenameFolderDialog({
    folderId,
    driveId,
    parentFolderId,
    open,
    onOpenChange,
}: RenameFolderDialogProps) {

    const {
        form,
        onSubmit,
        isLoading,
    } = useRenameFolder(
        folderId,
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
            title="Rename folder"
            footer={
                <>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                    >
                        Cancel
                    </Button>

                    <Button
                        type="submit"
                        form="rename-folder-form"
                        disabled={isLoading}
                    >
                        {isLoading ? "Renaming..." : "OK"}
                    </Button>
                </>
            }
        >
            <form id="rename-folder-form" onSubmit={onSubmit}>
                <FormTextField
                    control={control}
                    name="newFolderName"
                    label="Folder name"
                />
            </form>
        </AppDialog>
    );
}