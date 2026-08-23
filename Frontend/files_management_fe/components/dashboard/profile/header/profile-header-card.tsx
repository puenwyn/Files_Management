import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import AppCardSection from "../../card/app-card-section";
import { CloudUpload } from "lucide-react";

interface ProfileHeaderCard {
    fullName: string;
    userId: string;
    email: string;
    createdAt?: Date;
}

export default function ProfileHeaderCard({
    fullName,
    userId,
    email,
    createdAt
}: ProfileHeaderCard) {
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
                        <span className="text-lg text-foreground">{fullName}</span>
                        <span className="text-foreground/50">{userId}</span>
                        <span className="text-foreground/50">{email}</span>
                        <span className="text-foreground/50">{createdAt ? createdAt.toDateString() : ""}</span>
                    </div>
                </div>

                <div className="space-y-3">
                    <div className="flex gap-5">
                        <span className="text-primary"><CloudUpload className="size-12" /></span>
                        <div className="flex flex-col">
                            <span className="text-foreground/50">Storage Usage</span>
                            <span className="text-foreground/50">
                                <span className="text-primary text-lg font-semibold">7.4 GB </span>
                                of 15 GB used
                            </span>
                        </div>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                        <div
                            className="h-full rounded-full bg-primary"
                            style={{ width: "60%" }}
                        />
                    </div>
                    <div className="text-end">
                        <span className="text-foreground/50">49% used</span>
                    </div>
                </div>
            </div>
        </AppCardSection>
    )
}