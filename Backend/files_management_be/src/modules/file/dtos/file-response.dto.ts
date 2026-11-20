import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { FileStatus, PermissionType } from "@prisma/client";
import { FolderOwnerDTO } from "src/modules/folder/dtos/folder-owner.dto";

export class FileResponseDTO {
    @ApiProperty()
    id!: string;

    @ApiProperty()
    name!: string;

    @ApiProperty()
    extension!: string;

    @ApiProperty({ nullable: true })
    driveId!: string | null;

    @ApiProperty({ nullable: true })
    folderId!: string | null;

    @ApiProperty({ enum: FileStatus })
    status!: FileStatus;

    @ApiProperty({
        type: String,
        description: "File size in bytes",
    })
    size!: string;

    @ApiProperty()
    createdAt!: Date;

    @ApiProperty()
    updatedAt!: Date;

    @ApiPropertyOptional({
        type: FolderOwnerDTO,
    })
    owner?: FolderOwnerDTO;

    @ApiPropertyOptional({
        enum: PermissionType,
        nullable: true,
    })
    permissionType?: PermissionType | null;
}