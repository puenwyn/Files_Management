"use client"
import { Laptop, MonitorCog, Smartphone, TvMinimal } from "lucide-react";
import AppCardSection from "../../common/app-card-section";
import ProfileCardTitle from "../../profile/profile-card-title";
import SessionItem from "./session-item";
import SessionBox from "./session-box";
import { useGetSessions } from "@/hooks/auth/useGetSessions";
import { getDeviceIcon, parseDeviceName } from "@/utils/session";

function formatLastActive(date: string) {
    return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    }).format(new Date(date));
}

function formatLocation(ipAddress: string | null) {
    if (!ipAddress) {
        return "Unknown location";
    }

    if (ipAddress === "::1" || ipAddress === "127.0.0.1") {
        return "Localhost";
    }

    return ipAddress;
}

export default function SecuritySessionsCard() {

    const {
        devices,
        isPending,
        isError,
    } = useGetSessions();

    // const currentSession = devices.find(
    //     (session) => session.isCurrent
    // );

    // const otherSessions = devices.filter(
    //     (session) => !session.isCurrent
    // );

    return (
        <AppCardSection>
            <ProfileCardTitle
                icon={MonitorCog}
                title="Active Sessions"
                titleSub="Manage devices that are currently logged in to your account"
            />
            <SessionBox current>
                <SessionItem
                    icon={<Laptop />}
                    device="Windows"
                    browser="Chrome"
                    location="Ho Chi Minh City, Vietnam"
                    lastActive="Just now"
                    current
                />
            </SessionBox>

            <SessionBox>
                {devices.map((session) => {
                    const { device, browser } =
                        parseDeviceName(session.deviceName);

                    const Icon =
                        getDeviceIcon(session.deviceName);

                    return (
                        <SessionItem
                            key={session.id}
                            icon={<Icon />}
                            device={device}
                            browser={browser}
                            location={formatLocation(
                                session.ipAddress
                            )}
                            lastActive={formatLastActive(
                                session.createdAt
                            )}
                            onLogout={() => {
                                console.log(
                                    "Logout device:",
                                    session.id
                                );
                            }}
                        />
                    );
                })}
            </SessionBox>


        </AppCardSection>
    )
}