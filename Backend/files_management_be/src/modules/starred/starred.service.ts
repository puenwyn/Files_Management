import { Injectable, NotFoundException } from "@nestjs/common";
import { FolderStatus, ResourceType } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class StarredService {
    constructor(private readonly prisma: PrismaService) { }

    async addStarred(
        userId: string,
        resourceId: string,
        resourceType: ResourceType,
    ) {
        return this.prisma.starred.create({
            data: {
                userId,
                resourceId,
                resourceType,
            },
        });
    }

    async removeStarred(
        userId: string,
        resourceId: string,
        resourceType: ResourceType,
    ) {
        return this.prisma.starred.delete({
            where: {
                userId_resourceId_resourceType: {
                    userId,
                    resourceId,
                    resourceType,
                },
            },
        });
    }

    async getStarred(userId: string) {
        const starredItems = await this.prisma.starred.findMany({
            where: {
                userId,
                resourceType: ResourceType.FOLDER,
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        const folderIds = starredItems.map((item) => item.resourceId);

        if (folderIds.length === 0) {
            return {
                folders: [],
            };
        }

        const folders = await this.prisma.folder.findMany({
            where: {
                id: {
                    in: folderIds,
                },
                isDeleted: false,
            },
            include: {
                acls: {
                    where: {
                        OR: [
                            { isOwner: true },
                            { userId },
                        ],
                    },
                    select: {
                        userId: true,
                        isOwner: true,
                        permissionType: true,
                        user: {
                            select: {
                                id: true,
                                fullName: true,
                            },
                        },
                    },
                },
            },
        });

        const folderMap = new Map(
            folders.map((folder) => [folder.id, folder]),
        );

        const result = starredItems.flatMap((item) => {
            const folder = folderMap.get(item.resourceId);

            if (!folder) return [];

            const owner = folder.acls.find((acl) => acl.isOwner);
            const userACL = folder.acls.find(
                (acl) => acl.userId === userId,
            );

            if (!owner) return [];

            if (
                folder.status === FolderStatus.HIDDEN &&
                !owner.isOwner
            ) {
                return [];
            }

            return [{
                id: folder.id,
                folderName: folder.folderName,
                parentFolderId: folder.parentFolderId,
                driveId: folder.driveId,
                status: folder.status,
                createdAt: folder.createdAt,
                updatedAt: folder.updatedAt,
                owner: {
                    id: owner.user.id,
                    fullName: owner.user.fullName,
                },
                permissionType: userACL?.permissionType,
                isAccessed: !!userACL,
                starredAt: item.createdAt,
            }];
        });

        return {
            folders: result,
        };
    }
}