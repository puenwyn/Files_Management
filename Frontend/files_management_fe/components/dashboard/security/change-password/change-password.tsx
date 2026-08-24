"use client"
import { LockKeyhole } from "lucide-react";
import AppCardSection from "../../card/app-card-section";
import ProfileCardTitle from "../../profile/profile-card-title";
import FormTextField from "../../form/form-text-field";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";

type ChangePassword = {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}

export default function ChangePassword() {

    const {
        control,
        handleSubmit
    } = useForm<ChangePassword>({
        defaultValues: {
            currentPassword: "",
            newPassword: "",
            confirmPassword: ""
        }
    });

    return (
        <AppCardSection>
            <ProfileCardTitle
                icon={LockKeyhole}
                title="Change Password"
                titleSub="Update your password"
            />
            <form>
                <div className="grid grid-cols-3 gap-6">
                    <FormTextField
                        control={control}
                        name="currentPassword"
                        label="Current Password"
                        placeholder="Enter current password"
                    />
                    <FormTextField
                        control={control}
                        name="newPassword"
                        label="New Password"
                        placeholder="Enter new password"
                    />
                    <FormTextField
                        control={control}
                        name="confirmPassword"
                        label="Confirm Password"
                        placeholder="Enter confirm password"
                    />
                </div>
                <div className="flex gap-3 mt-6">
                    <Button type="submit">
                        Save Changes
                    </Button>

                    <Button type="button" variant="outline">
                        Cancel
                    </Button>
                </div>
            </form>

        </AppCardSection>
    )
}