import { Button } from "@/components/ui/button";
import { EllipsisVertical } from "lucide-react";
import Image from "next/image";

interface FileItemProps {
    name: string;
    image?: string;
}

export default function FileItem() {
    return (
        <div className="aspect-square bg-border/35 p-3 rounded-lg flex flex-col gap-3">
            <div className="flex justify-between items-center gap-3">
                <span className="truncate text-sm font-medium">This is Image with Aurora Background make everybody impressed</span>
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
            <div className="relative h-full w-full overflow-hidden rounded-md">
                <Image
                    src="/assets/images/aurorabackground.jpg"
                    alt=""
                    fill
                    className="object-cover"
                />
            </div>
        </div>
    )
}