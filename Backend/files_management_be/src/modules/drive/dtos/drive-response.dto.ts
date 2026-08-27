import { ApiProperty } from "@nestjs/swagger";

export class DriveResponseDTO {
    @ApiProperty()
    id!: string;

    @ApiProperty()
    driveName!: string;

    @ApiProperty()
    totalSpace!: string;

    @ApiProperty()
    usedSpace!: string;

    @ApiProperty()
    usedPercent!: number;

    @ApiProperty()
    primary!: boolean;

    @ApiProperty()
    createdAt!: Date;

    @ApiProperty()
    updatedAt!: Date;
}