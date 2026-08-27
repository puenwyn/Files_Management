import { ApiProperty } from "@nestjs/swagger";

export class FolderResponseDTO {
    @ApiProperty()
    id!: string;

    @ApiProperty()
    folderName!: string;

    @ApiProperty({ nullable: true })
    parentFolderId!: string | null;

    @ApiProperty()
    status!: string;

    @ApiProperty()
    createdAt!: Date;

    @ApiProperty()
    updatedAt!: Date;
}