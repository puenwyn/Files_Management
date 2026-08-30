import { ApiProperty } from "@nestjs/swagger";

export class FolderOwnerDTO {
    @ApiProperty()
    id!: string;

    @ApiProperty()
    fullName!: string;
}