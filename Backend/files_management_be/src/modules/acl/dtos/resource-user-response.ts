import { ApiProperty } from "@nestjs/swagger";
import { PermissionType } from "@prisma/client";

export class ResourceDetailUserDTO {
    @ApiProperty()
    id!: string;

    @ApiProperty()
    fullName!: string;

    @ApiProperty({
        enum: PermissionType,
    })
    permissionType!: PermissionType;

    @ApiProperty()
    isOwner!: boolean;
}