import { Card, CardContent } from "@/components/ui/card";
import ProfileCardTitle from "../profile-card-title";
import { ChevronRight, ListCheck } from "lucide-react";
import CompletionItem from "./completion-item";
import AppCardSection from "../../card/app-card-section";
import { Button } from "@/components/ui/button";

export default function ProfileCompletionCard() {
    return (
        <AppCardSection>
            <ProfileCardTitle
                icon={<ListCheck className="size-6" />}
                title="Personal Information"
                titleSub="Update your personal detail and information"
                component={<span>80%</span>}
            />
            <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                <div
                    className="h-full rounded-full bg-primary"
                    style={{ width: "60%" }}
                />
            </div>
            <div className="flex flex-col space-y-3">
                <CompletionItem
                    title="Profile photo"
                    completed={true}
                />
                <CompletionItem
                    title="Full Name"
                    completed={true}
                />
                <CompletionItem
                    title="Email address"
                    completed={true}
                />
                <CompletionItem
                    title="Add phone number"
                    completed={false}
                />
                <Button
                    type="button"
                    variant="outline"
                    className="w-80 justify-between text-muted-foreground"
                >
                    <span>Complete Profile</span>
                    <ChevronRight className="size-5 shrink-0" />
                </Button>
            </div>
        </AppCardSection>
    )
}