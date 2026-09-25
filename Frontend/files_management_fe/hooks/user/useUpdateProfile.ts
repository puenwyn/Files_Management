import { useForm } from "react-hook-form";
import { useProfile } from "../auth/useProfile.hook";
import { UpdateProfileRequest, updateProfileRequestSchema } from "@/schemas/user/update-profile.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { userService } from "@/services/user/user.service";
import { toast } from "@/components/ui/toast";

export function useUpdateProfile() {
    const {
        profile,
        isLoading,
        isError,
    } = useProfile();

    const form = useForm<UpdateProfileRequest>({
        resolver: zodResolver(updateProfileRequestSchema),
        defaultValues: {
            fullName: "",
            phoneNumber: "",
            bio: "",
            dob: undefined,
            gender: "Male",
        },
    });

    const { reset, handleSubmit, formState: { isDirty } } = form;

    useEffect(() => {
        if (!profile) return;

        reset({
            fullName: profile.fullName ?? "",
            phoneNumber: profile.phoneNumber ?? "",
            bio: profile.bio ?? "",
            dob: profile.dob ? new Date(profile.dob) : undefined,
            gender: profile.gender === "Male" || profile.gender === "Female" || profile.gender === "Other"
                ? profile.gender : undefined,
        });
    }, [profile, reset]);

    const updateProfileMutation = useMutation({
        mutationFn: userService.updateProfile,
        onSuccess: () => {
            toast.add({
                type: "success",
                description: "User information updated successfully!"
            });
        },
        onError: (error) => {
            toast.add({
                type: "error",
                description: error.message
            });
        },
    })

    const onSubmit = handleSubmit(async (value) => {
        updateProfileMutation.mutate(value);
    });

    return {
        form,
        onSubmit,
        isLoading: isLoading,
        isError: isError,
        isDirty: isDirty
    }
}