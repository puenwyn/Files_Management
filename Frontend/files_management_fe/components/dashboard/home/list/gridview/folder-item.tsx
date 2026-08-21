import { Button } from "@/components/ui/button";
import { EllipsisVertical } from "lucide-react";
import Image from "next/image";

interface FolderItemProps {
    name: string;
    items: number;
    list?: string[]
}

export default function FolderItem({
    name,
    items,
    list
}: FolderItemProps) {
    return (
        <div className="bg-border/35 p-3 rounded-lg">
            <div className="flex justify-between">
                <Image
                    src="/icons/azure-folder-blank.svg"
                    alt=""
                    width={30}
                    height={30}
                />

                <Button
                    variant="ghost"
                    size="icon"
                    className="
                        rounded-full
                        hover:bg-muted-foreground/5
                        active:bg-muted-foreground/10
                        cursor-pointer
                    "
                >
                    <EllipsisVertical className="size-4" />
                </Button>
            </div>
            <span className="font-medium">{name}</span>
            <br />
            <span className="text-sm">{`${items} items`}</span>
        </div>
    )
}