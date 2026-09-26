import { ApiProperty } from "@nestjs/swagger";

export class StorageResponseDTO {
    @ApiProperty()
    totalSpace!: number;

    @ApiProperty()
    usedSpace!: number;

    @ApiProperty()
    usedPercent!: number;
}