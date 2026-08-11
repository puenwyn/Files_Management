import { ApiProperty } from "@nestjs/swagger";
import { IsString, Length } from "class-validator";

export class HideFolderDTO {
    @ApiProperty({
        example: "123456",
        description: "Password used to protect the folder",
    })
    @IsString()
    @Length(6, 100)
    hashPassword!: string;
}