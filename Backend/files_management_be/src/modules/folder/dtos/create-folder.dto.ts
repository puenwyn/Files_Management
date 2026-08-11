import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString, IsUUID, Length } from "class-validator";

export class CreateFolderDTO {
    @ApiProperty({
        example: "My Documents"
    })
    @IsString()
    @Length(1, 255)
    folderName!: string;

    @ApiProperty({
        example: "folder-id"
    })
    @IsUUID()
    @IsOptional()
    parentFolderId?: string;

    @ApiProperty({
        example: "6b702242-dd2d-4e8a-a6ec-8c785f3ead83",
    })
    @IsUUID()
    driveId!: string
}