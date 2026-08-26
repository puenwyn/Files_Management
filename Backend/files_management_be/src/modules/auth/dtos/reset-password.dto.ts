import { ApiProperty } from "@nestjs/swagger";
import {
    IsEmail,
    IsString,
    Length,
    MinLength,
} from "class-validator";

export class ResetPasswordDTO {
    @ApiProperty({
        example: "nguyenhuy123nhon@gmail.com",
    })
    @IsEmail()
    email!: string;

    @ApiProperty({
        example: "123456",
        description: "OTP code sent to user's email",
    })
    @IsString()
    @Length(6, 6)
    otp!: string;

    @ApiProperty({
        example: "NewPassword123",
        minLength: 6,
    })
    @IsString()
    @MinLength(6)
    newPassword!: string;
}