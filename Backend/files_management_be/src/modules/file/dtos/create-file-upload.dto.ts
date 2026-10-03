import { IsArray, IsOptional, IsUUID, ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { UploadFileMetadataDTO } from "./upload-file-metadata.dto";

export class CreateFileUploadDTO {
    @IsUUID()
    driveId?: string | null;

    @IsOptional()
    @IsUUID()
    parentFolderId?: string | null;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => UploadFileMetadataDTO)
    files!: UploadFileMetadataDTO[];
}