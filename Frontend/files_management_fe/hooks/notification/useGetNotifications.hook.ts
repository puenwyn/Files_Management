import { notificationService } from "@/services/notification/notification.service";
import { useQuery } from "@tanstack/react-query";

export const useGetNotifications = () => {
    return useQuery({
        queryKey: ["notifications"],
        queryFn: notificationService.getNotifications,
    });
};