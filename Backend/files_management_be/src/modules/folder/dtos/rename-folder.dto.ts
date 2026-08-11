import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, MaxLength } from "class-validator";

export class RenameFolderDTO {
    @ApiProperty({
        example: "My Drive"
    })
    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    newFolderName!: string
}