import { ChartNoAxesColumn } from "lucide-react";
import AppCardSection from "../../card/app-card-section";
import ProfileCardTitle from "../profile-card-title";

interface StatItemProps {
    
}

function StatItem() {
    return (
        <div>

        </div>
    )
}

export default function ProfileStatCard() {
    return (
        <AppCardSection>
            <ProfileCardTitle
                icon={ChartNoAxesColumn}
                title="Stats"
                titleSub="Overview of your activity"
                component={<span>80%</span>}
            />
            <span>This is Overview</span>
        </AppCardSection>
    )
}