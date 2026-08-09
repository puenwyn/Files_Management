import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, MinLength } from "class-validator";

export class ResetPasswordDTO {
    @ApiProperty({
        example: "nguyenhuy123nhon@gmail.com",
    })
    @IsEmail()
    email!: string;

    @ApiProperty({
        example: "NewPassword123",
    })
    @IsString()
    @MinLength(8)
    newPassword!: string;
}