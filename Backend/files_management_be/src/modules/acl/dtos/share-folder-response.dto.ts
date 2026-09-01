import { ApiProperty } from "@nestjs/swagger";
import { PermissionType } from "@prisma/client";

export class SharedFolderResponseDTO {
    @ApiProperty()
    id!: string;

    @ApiProperty()
    folderId!: string;

    @ApiProperty()
    folderName!: string;

    @ApiProperty()
    parentFolderId!: string | null;

    @ApiProperty()
    driveId!: string;

    @ApiProperty()
    permissionType!: PermissionType;
}