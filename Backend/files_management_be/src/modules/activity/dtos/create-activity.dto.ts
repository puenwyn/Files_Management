import {
    IsNotEmpty,
    IsString,
    IsUUID,
} from 'class-validator';

export class CreateActivityDTO {
    @IsUUID()
    @IsNotEmpty()
    userId!: string;

    @IsUUID()
    @IsNotEmpty()
    folderId!: string;

    @IsString()
    @IsNotEmpty()
    action!: string;

    @IsNotEmpty()
    metadata?: object;
}