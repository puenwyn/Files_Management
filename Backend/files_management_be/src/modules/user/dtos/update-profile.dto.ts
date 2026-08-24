import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsDateString, IsIn, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from "class-validator";

export class UpdateProfileDTO {
    @ApiProperty({
        example: "Nguyễn Văn An",
        description: "Your new full name"
    })
    @IsNotEmpty()
    @IsString()
    fullName!: string;

    @ApiPropertyOptional({
        example: "0123456789",
        description: "Your new phone number"
    })
    @MinLength(10, { message: "Your phone number must be at least 10 characters" })
    @MaxLength(20, { message: "Your phone number must be at most 20 characters" })
    @IsString()
    @IsOptional()
    phoneNumber?: string;

    @ApiPropertyOptional({
        example: "Frontend Developer passionate about building beautiful and useful products",
        description: "Your new biography"
    })
    @IsOptional()
    @IsString()
    bio?: string;

    @ApiPropertyOptional({
        example: "2000-08-09",
        description: "Your date of birth",
    })
    @IsOptional()
    @IsDateString()
    dob?: string;


    @ApiPropertyOptional({
        example: "Male",
        description: "Your gender",
        default: "Male",
    })
    @IsString()
    @IsIn(["Male", "Female", "Other"], {
        message: "Gender must be Male, Female, or Other",
    })
    @IsOptional()
    gender?: string;
}