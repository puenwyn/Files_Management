import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class LoginDTO {
    @ApiProperty({
        example: "huy123"
    })
    @IsNotEmpty()
    @IsString()
    username!: string;

    @ApiProperty({
        example: "0123456789"
    })
    @IsNotEmpty()
    @IsString()
    password!: string;

    @ApiProperty({
        example: false,
        required: false,
        description: "Keep the user logged in on this device.",
    })
    @IsOptional()
    @IsBoolean()
    rememberMe?: boolean
}