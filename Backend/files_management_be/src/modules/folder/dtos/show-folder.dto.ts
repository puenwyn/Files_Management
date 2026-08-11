import { ApiProperty } from "@nestjs/swagger";
import { IsString, Length } from "class-validator";

export class ShowFolderDTO {
    @ApiProperty({
        example: "123456",
        description: "Folder password",
    })
    @IsString()
    @Length(6, 100)
    password!: string;
}