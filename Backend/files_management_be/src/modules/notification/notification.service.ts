import { Injectable, NotFoundException } from "@nestjs/common";
import { Notification, Prisma, ResourceType } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";
import { NotificationMetadata } from "./types/notification-metadata.type";
import { UserService } from "../user/user.service";
import { AppWebSocketGateway } from "src/infrastructure/websocket/websocket.gateway";
import { CreateNotificationDTO } from "./dtos/create-notification.dto";
import { NotificationResponseDTO } from "./dtos/notification-response.dto";

@Injectable()
export class NotificationService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly userService: UserService,
        private readonly websocketGateway: AppWebSocketGateway
    ) { }

    async createNotification(
        tx: Prisma.TransactionClient | PrismaService,
        userId: string,
        actorUserId: string,
        resourceId: string,
        resourceType: ResourceType,
        data: NotificationMetadata
    ) {
        return tx.notification.create({
            data: {
                userId,
                actorUserId,
                type: data.type,
                resourceId,
                resourceType,
                metadata: data.metadata as Prisma.InputJsonValue
            }
        });
    }

    sendRealtimeNotification(
        receiverId: string,
        notification: Notification
    ) {
        this.websocketGateway.sendNotification(
            receiverId,
            notification
        );
    }

    async getNotifications(userId: string): Promise<NotificationResponseDTO[]> {
        const user = await this.userService.findById(userId);
        if (!user) throw new NotFoundException("User is not found!");

        const notifications = await this.prisma.notification.findMany({
            where: { userId },
            orderBy: { createdAt: "desc" }
        });

        return notifications.map((notification) => ({
            id: notification.id,
            userId: notification.userId,
            actorUserId: notification.actorUserId,
            type: notification.type,
            resourceId: notification.resourceId,
            resourceType: notification.resourceType,
            metadata: notification.metadata as
                NotificationMetadata["metadata"] | null,
            isRead: notification.isRead,
            createdAt: notification.createdAt,
        }));
    }

    async markAllAsRead(userId: string) {
        const user = await this.userService.findById(userId);
        if (!user) throw new NotFoundException("User is not found!");

        await this.prisma.notification.updateMany({
            where: {
                userId,
                isRead: false
            },
            data: {
                isRead: true
            }
        });
        return {
            message: "Mark All Successfully!"
        }
    }

}