import { IsString, MinLength } from "class-validator";

export class VerifyPasswordDTO {
    @IsString()
    @MinLength(1)
    password!: string;
}