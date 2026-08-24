"use client"
import { Card, CardContent } from "@/components/ui/card"
import ProfileCardTitle from "../profile-card-title"
import { User } from "lucide-react"
import FormTextField from "../../form/form-text-field"
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import FormTextareaField from "../../form/form-textarea-field"
import FormDateField from "../../form/form-date-field"
import FormSelectField from "../../form/form-select-field"
import AppCardSection from "../../card/app-card-section"
import DisplayTextField from "../../form/display-text-field"
import { UpdateProfileRequest, updateProfileRequestSchema } from "@/schemas/user/update-profile.schema"
import { zodResolver } from "@hookform/resolvers/zod"

type ProfileForm = {
    fullName: string;
    username: string;
    email: string;
    phoneNumber: string;
    bio: string;
    dateOfBirth: Date | undefined;
    gender: string;
};

export default function ProfileInfoCard() {

    const {
        control,
        handleSubmit,
    } = useForm<UpdateProfileRequest>({
        resolver: zodResolver(updateProfileRequestSchema),

        defaultValues: {
            fullName: "Nguyễn Huy",
            phoneNumber: "+84 912 345 678",
            bio: "Frontend Developer passionate about building beautiful and useful products.",
            dateOfBirth: undefined,
            gender: "Male",
        },
    });

    const onSubmit = (data: UpdateProfileRequest) => {
        console.log(data);
    };

    return (
        <AppCardSection>
            <ProfileCardTitle
                icon={User}
                title="Personal Information"
                titleSub="Update your personal detail and information"
            />
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="grid grid-cols-2 gap-6">
                    <FormTextField
                        control={control}
                        name="fullName"
                        label="Full Name"
                    />

                    <DisplayTextField
                        label="Username"
                        value="nguyenhuy"
                    />

                    <DisplayTextField
                        label="Email"
                        value="nguyenhuy@example.com"
                    />

                    <FormTextField
                        control={control}
                        name="phoneNumber"
                        label="Phone Number"
                    />

                    <div className="col-span-2">
                        <FormTextareaField
                            control={control}
                            name="bio"
                            label="Bio"
                        />
                    </div>

                    <FormDateField
                        control={control}
                        name="dateOfBirth"
                        label="Date of Birth"
                    />

                    <FormSelectField
                        control={control}
                        name="gender"
                        label="Gender"
                        placeholder="Select gender"
                        options={[
                            { label: "Male", value: "Male" },
                            { label: "Female", value: "Female" },
                            { label: "Other", value: "Other" },
                        ]}
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