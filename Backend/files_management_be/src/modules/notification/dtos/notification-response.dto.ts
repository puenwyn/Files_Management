import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { NotificationType, ResourceType } from "@prisma/client";
import { NotificationMetadata } from "../types/notification-metadata.type";

export class NotificationResponseDTO {
    @ApiProperty()
    id!: string;

    @ApiProperty()
    userId!: string;

    @ApiProperty()
    actorUserId!: string;

    @ApiProperty({
        enum: NotificationType,
    })
    type!: NotificationType;

    @ApiProperty()
    resourceId!: string;

    @ApiProperty({
        enum: ResourceType,
    })
    resourceType!: ResourceType;

    @ApiPropertyOptional()
    metadata?: NotificationMetadata['metadata'] | null;

    @ApiProperty()
    isRead!: boolean;

    @ApiProperty()
    createdAt!: Date;
}