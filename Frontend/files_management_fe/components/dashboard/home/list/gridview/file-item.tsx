
import { Button } from "@/components/ui/button";
import { EllipsisVertical, File as FileIcon } from "lucide-react";
import Image from "next/image";

interface FileItemProps {
    id: string;
    name: string;
    extension: string;
    image?: string;
    onClick?: () => void;
}

export default function FileItem({
    id,
    name,
    extension,
    image,
    onClick,
}: FileItemProps) {
    const fileName = `${name}.${extension}`;

    return (
        <div
            data-id={id}
            onClick={onClick}
            className="aspect-square bg-border/35 p-3 rounded-lg flex flex-col gap-3 cursor-pointer hover:bg-border/50 transition-colors"
        >
            <div className="flex justify-between items-center gap-3">
                <span
                    className="truncate text-sm font-medium"
                    title={fileName}
                >
                    {fileName}
                </span>

                <Button
                    variant="ghost"
                    size="icon"
                    className="shrink-0 rounded-full hover:bg-muted-foreground/5 active:bg-muted-foreground/10"
                    onClick={(e) => {
                        e.stopPropagation();
                    }}
                >
                    <EllipsisVertical className="size-4" />
                </Button>
            </div>

            <div className="relative flex-1 min-h-0 w-full overflow-hidden rounded-md bg-muted flex items-center justify-center">
                {image ? (
                    <Image
                        src={image}
                        alt={fileName}
                        fill
                        unoptimized
                        className="object-cover"
                    />
                ) : (
                    <FileIcon className="size-16 text-muted-foreground" />
                )}
            </div>
        </div>
    );
}
