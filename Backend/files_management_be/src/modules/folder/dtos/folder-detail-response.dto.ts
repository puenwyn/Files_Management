import { ApiProperty } from "@nestjs/swagger";
import { ResourceDetailUserDTO } from "src/modules/acl/dtos/resource-user-response";

export class FolderDetailResponseDTO {
    @ApiProperty()
    id!: string;

    @ApiProperty()
    folderName!: string;

    @ApiProperty()
    driveId!: string;

    @ApiProperty()
    createdAt!: Date;

    @ApiProperty()
    updatedAt!: Date;

    @ApiProperty()
    owner!: ResourceDetailUserDTO;

    @ApiProperty({
        type: [ResourceDetailUserDTO],
    })
    users!: ResourceDetailUserDTO[];
}