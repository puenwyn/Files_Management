import { ApiProperty } from "@nestjs/swagger";

export class ProfileResponseDTO {
    @ApiProperty({
        example: "Nguyễn Huy",
        description: "User's full name",
    })
    fullName!: string;

    @ApiProperty({
        example: "nguyenhuy123@gmail.com",
        description: "User's email",
    })
    email!: string;

    @ApiProperty({
        example: "0123456789",
        nullable: true,
        description: "User's phone number",
    })
    phoneNumber!: string | null;

    @ApiProperty({
        example: "Frontend Developer",
        nullable: true,
        description: "User's biography",
    })
    bio!: string | null;

    @ApiProperty({
        example: "2000-08-09T00:00:00.000Z",
        nullable: true,
        description: "User's date of birth",
    })
    dob!: Date | null;

    @ApiProperty({
        example: "Male",
        nullable: true,
        enum: ["Male", "Female", "Other"],
        description: "User's gender",
    })
    gender!: string | null;

    @ApiProperty({
        example: "2026-08-24T12:29:44.984Z",
        description: "Last profile update date",
    })
    updatedAt!: Date;
}