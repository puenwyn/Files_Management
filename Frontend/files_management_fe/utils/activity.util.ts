
import { ActivityType } from "@/types/activity.type";
import { ActivityResponse } from "@/schemas/activity/activity-response.schema";

export function getActivityDescription(
    activity: ActivityResponse,
): string {
    switch (activity.action) {
        case ActivityType.CREATE:
            return `created folder "${String(activity.metadata?.folderName ?? "")}"`;

        case ActivityType.SHARE:
            return `shared this folder with "${String(
                activity.metadata?.targetUserName ?? ""
            )}" with ${String(
                activity.metadata?.permission ?? ""
            )} permission`;

        case ActivityType.RENAME:
            return `renamed "${String(
                activity.metadata?.oldName ?? ""
            )}" to "${String(
                activity.metadata?.newName ?? ""
            )
                } "`;

        case ActivityType.CHANGE_PERMISSION:
            return `changed permission for "${String(
                activity.metadata?.targetUserName ?? ""
            )}" from ${String(
                activity.metadata?.oldPermission ?? ""
            )} to ${String(
                activity.metadata?.newPermission ?? ""
            )}`;

        default:
            return "performed an action";
    }
}

export function formatActivityDate(date: string): string {
    return new Date(date).toLocaleString("en-EN");
}
