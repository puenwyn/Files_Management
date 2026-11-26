import { IsOptional, IsUUID } from "class-validator";

export class MoveFileDTO {
    @IsOptional()
    @IsUUID()
    targetDriveId?: string | null;

    @IsOptional()
    @IsUUID()
    targetFolderId?: string | null;
}