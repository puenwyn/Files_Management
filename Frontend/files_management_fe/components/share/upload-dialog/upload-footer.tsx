import { Button } from "@/components/ui/button";

interface UploadFooterProps {
    onCancel: () => void;
    onUpload: () => void;
    disabled?: boolean;
}

export function UploadFooter({
    onCancel,
    onUpload,
    disabled,
}: UploadFooterProps) {
    return (
        <div className="flex items-center justify-end gap-2 border-t px-6 py-4">
            <Button
                variant="ghost"
                onClick={onCancel}
            >
                Cancel
            </Button>

            <Button
                onClick={onUpload}
                disabled={disabled}
            >
                Upload
            </Button>
        </div>
    );
}