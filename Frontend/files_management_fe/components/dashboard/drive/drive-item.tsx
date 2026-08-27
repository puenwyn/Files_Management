"use client"
import { EllipsisVertical, HardDrive } from "lucide-react";
import AppIconButton from "../iconbutton/app-icon-button";
import { Card } from "@/components/ui/card";
import { useRouter } from "next/navigation";

interface DriveItemProps {
    id: string
    driveName: string;
    totalStorage: number;
    usedStorage: number;
    usedPercent: number;
    primary?: boolean
}

export default function DriveItem({
    id,
    driveName,
    totalStorage,
    usedStorage,
    usedPercent,
    primary = false
}: DriveItemProps) {

    const router = useRouter();

    return (
        <Card
            onDoubleClick={() => router.push(`/drives/${id}`)}
            className="p-3 bg-card cursor-pointer hover:bg-muted/30"
        >
            <div className="flex items-center justify-between">
                <span className="shrink-0 rounded-md bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
                    Primary
                </span>
                <AppIconButton
                    icon={EllipsisVertical}
                />
            </div>
            <div className="flex justify-between gap-3">
                <span className="text-primary shrink-0">
                    <HardDrive className="size-10" />
                </span>
                <p className="flex-1 line-clamp-2 font-semibold select-none">{driveName}</p>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                <div
                    className="h-full rounded-full bg-primary"
                    style={{ width: `${usedPercent}%` }}
                />
            </div>
            <div className="flex gap-1 justify-end items-center">
                <span className="text-xs font-semibold select-none">{`${usedStorage} GB used`}</span>
                <span className="text-xs select-none">{`of ${totalStorage} GB`}</span>
            </div>
        </Card>
    )
}