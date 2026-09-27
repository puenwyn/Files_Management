import { ActivityType } from "@/types/activity.type";
import { NotificationType } from "@/types/notification.type";
import { ResourceType } from "@/types/resource.type";
import z from "zod";

export const userActivitySchema = z.object({
    id: z.string(),
    fullName: z.string()
});

export const activityResponseSchema = z.object({
    id: z.string(),
    action: z.enum(ActivityType),
    metadata: z.record(z.string(), z.unknown()).nullable(),
    createdAt: z.string(),
    user: userActivitySchema
});

export const activityListResponseSchema = z.array(activityResponseSchema);

export type ActivityResponse = z.infer<typeof activityResponseSchema>;
export type ActivityListResponse = z.infer<typeof activityListResponseSchema>;