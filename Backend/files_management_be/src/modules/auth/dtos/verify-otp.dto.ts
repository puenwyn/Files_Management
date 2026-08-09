import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, Length } from "class-validator";

export class VerifyOtpDTO {
    @ApiProperty({
        example: "nguyenhuy123nhon@gmail.com",
    })
    @IsEmail()
    email!: string;

    @ApiProperty({
        example: "483921",
    })
    @IsString()
    @Length(6, 6)
    otp!: string;
}