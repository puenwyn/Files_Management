import { useQuery } from "@tanstack/react-query";
import { activityService } from "@/services/activity/activity.service";

export function useGetFolderActivities(folderId: string) {
    return useQuery({
        queryKey: ["activities", folderId],
        queryFn: () => activityService.getActivities(folderId!),
        enabled: !!folderId,
    });
}