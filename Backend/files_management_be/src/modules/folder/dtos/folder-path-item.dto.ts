import { ApiProperty } from "@nestjs/swagger";

export class FolderPathItemDTO {
    @ApiProperty()
    id!: string;

    @ApiProperty()
    folderName!: string;
}