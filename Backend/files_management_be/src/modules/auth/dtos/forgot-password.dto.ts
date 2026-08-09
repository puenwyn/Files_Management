import { ApiProperty } from "@nestjs/swagger";
import { IsEmail } from "class-validator";

export class ForgotPasswordDTO {
    @ApiProperty({
        example: "nguyenhuy123nhon@gmail.com"
    })
    @IsEmail()
    email!: string
}