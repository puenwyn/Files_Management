import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, IsUUID } from "class-validator";

export class ShareableUserResponseDTO {
    @ApiProperty()
    @IsUUID()
    id!: string;

    @ApiProperty()
    @IsString()
    fullName!: string;

    @ApiProperty()
    @IsEmail()
    email!: string
}