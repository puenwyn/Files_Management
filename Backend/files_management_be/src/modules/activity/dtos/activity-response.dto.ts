import { ActivityAction } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { ActivityMetadata } from '../types/activity-metadata.type';

export class ActivityUserDTO {
    @ApiProperty()
    id!: string;

    @ApiProperty()
    fullName!: string;
}

export class ActivityResponseDTO {
    @ApiProperty()
    id!: string;

    @ApiProperty()
    action!: ActivityAction;

    @ApiProperty()
    metadata?: ActivityMetadata['metadata'] | null;

    @ApiProperty({
        example: '2026-09-13T08:00:00.000Z',
        description: 'Time when the activity occurred',
    })
    createdAt!: Date;

    @ApiProperty()
    user!: ActivityUserDTO;
}