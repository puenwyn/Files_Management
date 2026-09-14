import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ActivityMetadata } from './types/activity-metadata.type';
import { Prisma } from '@prisma/client';
import { ActivityResponseDTO } from './dtos/activity-response.dto';

@Injectable()
export class ActivityService {
    constructor(private readonly prisma: PrismaService) { }

    async createActivity(
        tx: Prisma.TransactionClient | PrismaService,
        userId: string,
        folderId: string,
        data: ActivityMetadata
    ) {
        return tx.activity.create({
            data: {
                userId,
                folderId,
                action: data.action,
                metadata: data.metadata as Prisma.InputJsonValue
            }
        });
    }

    async getFolderActivities(folderId: string): Promise<ActivityResponseDTO[]> {
        const activities = await this.prisma.activity.findMany({
            where: {
                folderId,
            },
            select: {
                id: true,
                action: true,
                metadata: true,
                createdAt: true,
                user: {
                    select: { id: true, fullName: true, },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        return activities.map((activity) => ({
            id: activity.id,
            action: activity.action,
            metadata: activity.metadata as ActivityMetadata['metadata'],
            createdAt: activity.createdAt,
            user: activity.user,
        }));
    }
}
