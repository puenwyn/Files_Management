import { File, Folder } from "lucide-react";
import { DialogTitle } from "@/components/ui/dialog";
import { ResourceType } from "@/types/resource.type";

interface ShareHeaderProps {
    resourceName: string;
    resourceType: ResourceType;
}

export function ShareHeader({
    resourceName,
    resourceType,
}: ShareHeaderProps) {
    const Icon = resourceType === ResourceType.FOLDER ? Folder : File;

    return (
        <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50">
                <Icon
                    className={
                        resourceType === ResourceType.FOLDER
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
                    {resourceType === ResourceType.FOLDER ? "Folder" : "File"} · Manage access
                </p>
            </div>
        </div>
    );
}