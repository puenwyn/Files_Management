import AppDialog from "@/components/dashboard/common/app-dialog";
import FormTextField from "@/components/dashboard/form/form-text-field";
import { Button } from "@/components/ui/button";
import { useVerifyPassword } from "@/hooks/auth/useVerifyPassword.hook";
import { useHideFolder } from "@/hooks/folder/useHideFolder.hook";
import { useRenameFolder } from "@/hooks/folder/useRenameFolder.hook";

interface VerifyPasswordDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess?: () => void;
}

export default function VerifyPasswordDialog({
    open,
    onOpenChange,
    onSuccess
}: VerifyPasswordDialogProps) {

    const {
        form,
        onSubmit,
        isLoading,
    } = useVerifyPassword(
        () => {
            form.reset();
            onOpenChange(false);
            onSuccess?.();
        }
    );

    const { control } = form;

    return (
        <AppDialog
            open={open}
            onOpenChange={onOpenChange}
            title="Hide folder"
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
                        form="hide-folder-form"
                        disabled={isLoading}
                    >
                        {isLoading ? "Renaming..." : "OK"}
                    </Button>
                </>
            }
        >
            <form id="hide-folder-form" onSubmit={onSubmit}>
                <FormTextField
                    control={control}
                    name="password"
                    label="Your password"
                    type="password"
                    placeholder="Enter your password"
                />
            </form>
        </AppDialog>
    );
}