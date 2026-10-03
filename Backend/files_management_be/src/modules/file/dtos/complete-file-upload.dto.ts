import { IsUUID } from "class-validator";

export class CompleteFileUploadDTO {
    @IsUUID()
    fileVersionId!: string;
}