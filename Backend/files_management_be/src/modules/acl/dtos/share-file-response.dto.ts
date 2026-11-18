import { ApiProperty } from "@nestjs/swagger";
import { PermissionType } from "@prisma/client";

export class SharedFileResponseDTO {
    @ApiProperty()
    id!: string;

    @ApiProperty()
    fileId!: string;

    @ApiProperty()
    fileName!: string;

    @ApiProperty()
    folderId!: string | null;

    @ApiProperty()
    permissionType!: PermissionType;
}