import { ApiProperty } from "@nestjs/swagger";
import { FolderOwnerDTO } from "./folder-owner.dto";

export class FolderResponseDTO {
    @ApiProperty()
    id!: string;

    @ApiProperty()
    folderName!: string;

    @ApiProperty({ nullable: true })
    parentFolderId!: string | null;

    @ApiProperty()
    driveId!: string;

    @ApiProperty()
    status!: string;

    @ApiProperty()
    createdAt!: Date;

    @ApiProperty()
    updatedAt!: Date;

    @ApiProperty({
        type: FolderOwnerDTO,
    })
    owner!: FolderOwnerDTO;
}