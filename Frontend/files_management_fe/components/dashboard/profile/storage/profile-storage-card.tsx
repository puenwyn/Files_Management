import { Card, CardContent } from "@/components/ui/card";
import ProfileCardTitle from "../profile-card-title";
import { ChartPie } from "lucide-react";
import AppCardSection from "../../common/app-card-section";

interface ChartNoteProps {
    color: string;
    note: string;
    storage: number;
}

function ChartNote({
    color,
    note,
    storage
}: ChartNoteProps) {
    return (
        <div className="flex items-center gap-3">
            <div className={`bg-${color} size-4 rounded-full`} />
            <div className="flex flex-col justify-around">
                <span>{note}</span>
                <span>{storage} GB</span>
            </div>
        </div>
    )
}

export default function ProfileStorageCard() {
    return (
        <AppCardSection>
            <ProfileCardTitle
                icon={ChartPie}
                title="Storage Overview"
                titleSub="See how your storage is being used"
                component={<span>80%</span>}
            />
            <div className=" h-4 w-full flex bg-chart-1 rounded-lg overflow-hidden">
                <div className="bg-chart-2" style={{ width: "40%" }} />
                <div className="bg-chart-3" style={{ width: "10%" }} />
                <div className="bg-chart-4" style={{ width: "25%" }} />
                <div className="bg-chart-5" style={{ width: "5%" }} />
            </div>
            <div className="flex justify-between">
                <ChartNote
                    color="chart-2"
                    note="Documents"
                    storage={4.5}
                />
                <ChartNote
                    color="chart-3"
                    note="Images"
                    storage={1.5}
                />
                <ChartNote
                    color="chart-4"
                    note="Videos"
                    storage={3.0}
                />
                <ChartNote
                    color="chart-5"
                    note="Others"
                    storage={1.0}
                />
                <ChartNote
                    color="chart-1"
                    note="Free"
                    storage={5.0}
                />
            </div>
        </AppCardSection>
    )
}