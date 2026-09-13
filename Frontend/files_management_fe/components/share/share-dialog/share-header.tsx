import { File, Folder } from "lucide-react";
import { DialogTitle } from "@/components/ui/dialog";

interface ShareHeaderProps {
    resourceName: string;
    resourceType: "folder" | "file";
}

export function ShareHeader({
    resourceName,
    resourceType,
}: ShareHeaderProps) {
    const Icon = resourceType === "folder" ? Folder : File;

    return (
        <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50">
                <Icon
                    className={
                        resourceType === "folder"
                            ? "h-6 w-6 fill-blue-100 text-blue-500"
                            : "h-6 w-6 text-blue-500"
                    }
                />
            </div>

            <div className="min-w-0">
                <DialogTitle className="truncate text-lg font-semibold">
                    Share "{resourceName}"
                </DialogTitle>

                <p className="mt-1 text-sm text-muted-foreground">
                    {resourceType === "folder" ? "Folder" : "File"} · Manage access
                </p>
            </div>
        </div>
    );
}