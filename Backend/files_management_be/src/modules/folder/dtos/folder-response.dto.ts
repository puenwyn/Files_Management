import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { FolderOwnerDTO } from "./folder-owner.dto";
import { FolderStatus, PermissionType } from "@prisma/client";

export class FolderResponseDTO {
    @ApiProperty()
    id!: string;

    @ApiProperty()
    folderName!: string;

    @ApiProperty({ nullable: true })
    parentFolderId!: string | null;

    @ApiProperty()
    driveId!: string;

    @ApiProperty({
        enum: FolderStatus,
    })
    status!: FolderStatus;

    @ApiProperty()
    createdAt!: Date;

    @ApiProperty()
    updatedAt!: Date;

    @ApiProperty({
        type: FolderOwnerDTO,
    })
    owner!: FolderOwnerDTO;

    @ApiPropertyOptional({
        enum: PermissionType,
        nullable: true,
    })
    permissionType!: PermissionType | null;
}