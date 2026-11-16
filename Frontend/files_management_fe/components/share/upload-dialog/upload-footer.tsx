
import { LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface UploadFooterProps {
    onCancel: () => void;
    onUpload: () => void;
    disabled?: boolean;
    isLoading?: boolean;
}

export function UploadFooter({
    onCancel,
    onUpload,
    disabled,
    isLoading,
}: UploadFooterProps) {
    return (
        <div className="flex items-center justify-end gap-2 border-t px-6 py-4">
            <Button
                variant="ghost"
                onClick={onCancel}
                disabled={isLoading}
            >
                Close
            </Button>

            <Button
                onClick={onUpload}
                disabled={disabled || isLoading}
            >
                {isLoading && (
                    <LoaderCircle className="mr-2 size-4 animate-spin" />
                )}
                {isLoading ? "Uploading..." : "Upload"}
            </Button>
        </div>
    );
}
