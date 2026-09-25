import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import AppCardSection from "../../common/app-card-section";
import { CalendarIcon, CloudUpload } from "lucide-react";
import { useProfile } from "@/hooks/auth/useProfile.hook";
import { useGetTotalStorage } from "@/hooks/drive/useGetTotalStorage.hook";

export default function ProfileHeaderCard() {

    const {
        profile,
        isLoading,
        isError,
    } = useProfile();

    const { storage } = useGetTotalStorage();
    console.log("HEY THIS IS STORAGE", storage);

    return (
        <AppCardSection>
            <div className="grid grid-cols-2">
                <div className="flex gap-3">
                    <Avatar className="size-24">
                        <AvatarImage
                            src={"/assets/images/aurorabackground.jpg"}
                        />
                        <AvatarFallback>Avatar</AvatarFallback>
                    </Avatar>

                    <div className="flex flex-col gap-1">
                        <span className="text-lg text-foreground">{profile?.fullName}</span>
                        <span className="text-foreground/50">{profile?.username}</span>
                        <span className="text-foreground/50">{profile?.email}</span>
                        <div className="flex gap-1 items-center">
                            <span className="text-foreground/50"><CalendarIcon className="size-4" /></span>
                            <span className="text-foreground/50">
                                Joined{" "}
                                {profile?.createdAt
                                    ? new Date(profile.createdAt).toLocaleDateString("en-US", {
                                        month: "short",
                                        day: "numeric",
                                        year: "numeric",
                                    })
                                    : ""}
                            </span>
                        </div>

                    </div>
                </div>

                <div className="space-y-3">
                    <div className="flex gap-5">
                        <span className="text-primary"><CloudUpload className="size-12" /></span>
                        <div className="flex flex-col">
                            <span className="text-foreground/50">Storage Usage</span>
                            <span className="text-foreground/50">
                                <span className="text-primary text-lg font-semibold">{`${storage?.usedSpace} GB `}</span>
                                {`of ${storage?.totalSpace} GB used`}
                            </span>
                        </div>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                        <div
                            className="h-full rounded-full bg-primary"
                            style={{ width: storage?.usedPercent }}
                        />
                    </div>
                    <div className="text-end">
                        <span className="text-foreground/50">{`${storage?.usedPercent}%`}</span>
                    </div>
                </div>
            </div>
        </AppCardSection>
    )
}