"use client"
import Image from "next/image";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarBadge, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, ChevronDown } from "lucide-react";
import { dropdownmenuItems } from "@/constants/dashboard/dropdown-menu";
import MenuItem from "./menu-item";
import { useRouter } from "next/navigation";
import React from "react";
import { useLogout } from "@/hooks/auth/useLogout";
import LoadingOverlay from "@/components/common/loading-overlay";
import { useProfile } from "@/hooks/auth/useProfile.hook";

export default function UserDropdownMenu() {

    const router = useRouter();

    const { profile, isLoading, isError } = useProfile();

    const { logout, isPending } = useLogout();


    return (
        <>
            <LoadingOverlay loading={isPending} />
            <DropdownMenu>
                <DropdownMenuTrigger
                    className="
                    rounded-lg
                    p-2
                    outline-none
                    flex items-center gap-1
                    cursor-pointer
                    hover:bg-accent

                "
                >
                    <Avatar className="size-8">
                        {/* <AvatarImage
                            src={"/assets/images/aurorabackground.jpg"}
                        /> */}
                        <AvatarFallback>{profile?.fullName.charAt(0)}</AvatarFallback>
                    </Avatar>

                    <span className="w-20 truncate text-xs font-medium text-foreground">
                        {profile?.fullName}
                    </span>

                    <ChevronDown className="size-4" />

                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="w-80 ring-2 ring-border/35 bg-card/75 backdrop-blur-3xl">

                    <div className="p-4 text-center flex flex-col justify-center items-center gap-3">
                        <span className="text-lg font-semibold">Nguyễn Huy</span>
                        <Avatar className="size-18">
                            {/* <AvatarImage
                                src={"/assets/images/aurorabackground.jpg"}
                            /> */}
                            <AvatarFallback className="text-4xl">{profile?.fullName.charAt(0)}</AvatarFallback>
                            <AvatarBadge className="!size-4">
                                <Camera className="size-3.5" />
                            </AvatarBadge>
                        </Avatar>
                    </div>

                    {dropdownmenuItems.map((item, index) => {
                        const Icon = item.icon;
                        const isSeperator = item.seperator === true;

                        return (
                            <React.Fragment key={index}>
                                {isSeperator ? <DropdownMenuSeparator /> : ""}
                                <MenuItem
                                    key={index}
                                    icon={<Icon className="size-6" />}
                                    label={item.label}
                                    description={item.description}
                                    onSelect={() => {
                                        if (item.variant === "destructive") {
                                            logout();
                                            return;
                                        }

                                        router.push(item.href!);
                                    }}
                                    variant={item.variant}
                                />
                            </React.Fragment>
                        )
                    })}

                </DropdownMenuContent>
            </DropdownMenu>
        </>
    );
}