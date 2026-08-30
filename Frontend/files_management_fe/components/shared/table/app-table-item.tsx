import AppIconButton from "@/components/dashboard/iconbutton/app-icon-button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { EllipsisVertical } from "lucide-react";

interface AppTableItemProps {
    id: string;
    name: string;
    owner: string;
    updatedAt: string;
    size: string;
    type?: "file" | "folder";
    className?: string;
}

export default function AppTableItem({
    id,
    name,
    owner,
    updatedAt,
    size,
    type = "folder",
    className
}: AppTableItemProps) {
    return (
        <div
            className={cn(
                "grid h-12 items-center border-b px-4",
                "grid-cols-[minmax(200px,1fr)_180px_100px]",
                "sm:grid-cols-[minmax(220px,1fr)_140px_180px_100px]",
                "lg:grid-cols-[minmax(280px,1fr)_180px_180px_200px_100px]",
                "text-sm font-normal text-foreground/80",
                "bg-card hover:bg-muted",
                className
            )}
        >
            <div className="w-full pr-2 select-none">
                <p className="truncate text-foreground font-medium">{name}</p>
            </div>

            <div className="hidden sm:flex items-center gap-1 select-none ">
                <Avatar className="size-5">
                    <AvatarImage
                        src={"/assets/images/aurorabackground.jpg"}
                    />
                    <AvatarFallback>Avatar</AvatarFallback>
                </Avatar>
                <p className="truncate">
                    {owner}
                </p>
            </div>

            <div className="hidden lg:block select-none">
                <p className="truncate">{updatedAt}</p>
            </div>

            <div className="select-none">
                <p className="truncate">{size}</p>
            </div>

            <div className="select-none">
                <AppIconButton icon={EllipsisVertical} />
            </div>
        </div>
    )
}