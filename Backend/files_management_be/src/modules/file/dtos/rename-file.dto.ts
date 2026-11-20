
import { IsNotEmpty, IsString, MaxLength } from "class-validator";

export class RenameFileDTO {
    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    newName!: string;
}
