import { ApiProperty } from "@nestjs/swagger";
import { ResourceDetailUserDTO } from "src/modules/acl/dtos/resource-user-response";

export class FileDetailResponseDTO {
    @ApiProperty()
    id!: string;

    @ApiProperty()
    name!: string;

    @ApiProperty()
    extension!: string;

    @ApiProperty()
    mimeType!: string;

    @ApiProperty()
    size!: string;

    @ApiProperty({ nullable: true })
    driveId!: string | null;

    @ApiProperty({ nullable: true })
    folderId!: string | null;

    @ApiProperty()
    status!: string;

    @ApiProperty({ nullable: true })
    previewUrl!: string | null;

    @ApiProperty()
    createdAt!: Date;

    @ApiProperty()
    updatedAt!: Date;

    @ApiProperty({ nullable: true })
    accessedAt!: Date | null;

    @ApiProperty({ type: ResourceDetailUserDTO })
    owner!: ResourceDetailUserDTO;

    @ApiProperty({
        type: [ResourceDetailUserDTO],
    })
    users!: ResourceDetailUserDTO[];
}