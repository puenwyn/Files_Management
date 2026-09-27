import { useGetFolderActivities } from "@/hooks/activity/useGetFolderActivities.hook";
import { formatActivityDate, getActivityDescription } from "@/utils/activity.util";

interface ResourceActivityProps {
    resourceId: string
}

export default function ResourceActivity({
    resourceId
}: ResourceActivityProps) {

    const { data: activities, isLoading, isError, } = useGetFolderActivities(resourceId);

    return (
        <div>
            {activities?.map((activity) => (
                <div key={activity.id} className="flex gap-3" >
                    <div className="size-8 shrink-0 rounded-full bg-muted flex items-center justify-center text-sm font-medium">
                        {activity.user.fullName.charAt(0)}
                    </div> <div className="min-w-0 flex-1">
                        <p className="text-sm leading-5">
                            <span className="font-medium">
                                {activity.user.fullName} </span>{" "} {getActivityDescription(activity)}
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                            {formatActivityDate(activity.createdAt)}
                        </p>
                    </div>
                </div>))}
        </div>
    )
}