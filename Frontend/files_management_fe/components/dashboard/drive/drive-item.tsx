import { EllipsisVertical } from "lucide-react";
import AppCardSection from "../common/app-card-section";
import AppIconButton from "../iconbutton/app-icon-button";

interface DriveItemProps {
    title: string;
    totalStorage: number;
    usedStorage: number;
    usedPercent: number;
}

export default function DriveItem({
    title,
    totalStorage,
    usedStorage,
    usedPercent
}: DriveItemProps) {
    return (
        <AppCardSection>
            <div className="flex items-center">
                <span className="shrink-0 rounded-md bg-primary/10 px-2 py-0.5 text-xs text-primary">
                    Current session
                </span>
                <AppIconButton
                    icon={EllipsisVertical}
                />
            </div>
            <div>
                
            </div>
        </AppCardSection>
    )
}