import { ApiProperty } from "@nestjs/swagger";
import { PermissionType } from "@prisma/client";
import { IsEnum, IsUUID } from "class-validator";

export class ShareFileDTO {
    @ApiProperty({
        example: "4536daf6-0f47-4349-8941-b171fbab24d2",
        description: "ID of the user who will receive the file",
    })
    @IsUUID()
    targetUserId!: string;

    @ApiProperty({
        enum: PermissionType,
        example: PermissionType.VIEW,
        description: "Permission granted to the target user",
    })
    @IsEnum(PermissionType)
    permission!: PermissionType;
}