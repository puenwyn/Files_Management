import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

export class RegisterDTO {
    @ApiProperty({
        example: "Nguyễn Văn An",
        description: "Fullname of user"
    })
    @IsNotEmpty()
    @IsString()
    fullName!: string;

    @ApiProperty({
        example: "nguyenvana",
        description: "Username of user account"
    })
    @IsNotEmpty()
    @IsString()
    username!: string;

    @ApiProperty({
        example: "nguyenvanan@gmail.com",
        description: "Email of user"
    })
    @IsNotEmpty()
    @IsEmail()
    email!: string;

    @ApiProperty({
        example: "0123456789",
        description: "Password of user account"
    })
    @IsNotEmpty()
    @IsString()
    @MinLength(6)
    password!: string;
}