import {
    IsEnum,
    IsNotEmpty,
    IsObject,
    IsUUID,
} from "class-validator";
import {
    NotificationType,
    ResourceType,
} from "@prisma/client";

export class CreateNotificationDTO {
    @IsUUID()
    userId!: string;

    @IsUUID()
    actorUserId!: string;

    @IsEnum(NotificationType)
    type!: NotificationType;

    @IsUUID()
    resourceId!: string;

    @IsEnum(ResourceType)
    resourceType!: ResourceType;

    @IsNotEmpty()
    metadata?: object;
}