import { ApiProperty } from "@nestjs/swagger";
import { PermissionType } from "@prisma/client";

export class ACLUserResponseDTO {
    @ApiProperty()
    id!: string;

    @ApiProperty()
    fullName!: string;

    @ApiProperty()
    email!: string;

    @ApiProperty({
        enum: PermissionType,
    })
    permissionType!: PermissionType;

    @ApiProperty()
    isOwner!: boolean;
}