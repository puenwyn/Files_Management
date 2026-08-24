import { Laptop, MonitorCog, Smartphone, TvMinimal } from "lucide-react";
import AppCardSection from "../../card/app-card-section";
import ProfileCardTitle from "../../profile/profile-card-title";
import SessionItem from "./session-item";
import SessionBox from "./session-box";

export default function SecuritySessionsCard() {
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
                <SessionItem
                    icon={<Smartphone />}
                    device="Android"
                    browser="Chrome"
                    location="Ho Chi Minh City, Vietnam"
                    lastActive="2 hours ago"
                />
                <SessionItem
                    icon={<TvMinimal />}
                    device="Windows"
                    browser="Chrome"
                    location="Ho Chi Minh City, Vietnam"
                    lastActive="2 hours ago"
                />
            </SessionBox>


        </AppCardSection>
    )
}