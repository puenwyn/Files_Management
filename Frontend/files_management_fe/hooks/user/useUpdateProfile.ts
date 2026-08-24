import { useForm } from "react-hook-form";
import { useProfile } from "../auth/useProfile.hook";
import { UpdateProfileRequest, updateProfileRequestSchema } from "@/schemas/user/update-profile.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { userService } from "@/services/user/user.service";

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

    const { reset, handleSubmit } = form;

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
        onSuccess: (data) => {
            console.log("Update success:", data);
        },
        onError: (error) => {
            console.log("Error:", error.message);
        },
    })

    const onSubmit = handleSubmit(async (value) => {
        updateProfileMutation.mutate(value);
    });

    return {
        form,
        onSubmit,
        isLoading: isLoading,
        isError: isError
    }
}