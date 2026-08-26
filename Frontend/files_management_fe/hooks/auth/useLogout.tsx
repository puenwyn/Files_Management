import { toast } from "@/components/ui/toast";
import { authService } from "@/services/auth/auth.service";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export function useLogout() {

    const router = useRouter();

    const logoutMutation = useMutation({
        mutationFn: authService.logout,
        onSuccess: () => {
            toast.add({
                type: "success",
                description: "Log out successful!"
            });
            router.push("/login");
        },
        onError: (error) => {
            console.log("Logout error:", error.message);
        },
    });

    return {
        logout: logoutMutation.mutate,
        isPending: logoutMutation.isPending
    }
}