import { NotificationType } from "@/types/notification.type";
import { ResourceType } from "@/types/resource.type";
import z from "zod";

export const notificationResponseSchema = z.object({
    id: z.string(),
    userId: z.string(),
    actorUserId: z.string(),
    type: z.enum(NotificationType),
    resourceId: z.string(),
    resourceType: z.enum(ResourceType),
    metadata: z.record(z.string(), z.unknown()).nullable(),
    isRead: z.boolean(),
    createdAt: z.string(),
});

export const notificationListResponseSchema = z.array(notificationResponseSchema);

export type NotificationResponse = z.infer<typeof notificationResponseSchema>;
export type NotificationListResponse = z.infer<typeof notificationListResponseSchema>;