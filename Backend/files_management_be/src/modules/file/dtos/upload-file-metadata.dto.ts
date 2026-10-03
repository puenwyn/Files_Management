import { IsInt, IsString, IsUUID, MaxLength, Min } from "class-validator";

export class UploadFileMetadataDTO {
    @IsUUID()
    label!: string;

    @IsString()
    @MaxLength(100)
    name!: string;

    @IsString()
    @MaxLength(10)
    extension!: string;

    @IsInt()
    @Min(0)
    size!: number;

    @IsString()
    @MaxLength(100)
    mimeType!: string;

    @IsString()
    @MaxLength(100)
    sha256!: string;
}