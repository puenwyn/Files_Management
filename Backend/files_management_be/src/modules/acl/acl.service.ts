import { BadRequestException, ConflictException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { FolderService } from "../folder/folder.service";
import { ActivityAction, NotificationType, PermissionType, Prisma, ResourceType } from "@prisma/client";
import { SharedFolderResponseDTO } from "./dtos/share-folder-response.dto";
import { FolderResponseDTO } from "../folder/dtos/folder-response.dto";
import { ACLUserResponseDTO } from "./dtos/share-user-response.dto";
import { ActivityService } from "../activity/activity.service";
import { UserService } from "../user/user.service";
import { NotificationService } from "../notification/notification.service";

@Injectable()
export class ACLService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly userService: UserService,
        private readonly activityService: ActivityService,
        private readonly notificationService: NotificationService
    ) { }

    async createACL(
        tx: Prisma.TransactionClient | PrismaService,
        data: {
            userId: string;
            folderId: string;
            permissionType: PermissionType;
            isOwner?: boolean;
        },
    ) {
        return tx.aCL.create({
            data: {
                userId: data.userId,
                folderId: data.folderId,
                permissionType: data.permissionType,
                isOwner: data.isOwner ?? false,
            },
        });
    }

    private hasPermission(current: PermissionType, required: PermissionType): boolean {
        const permissions = {
            VIEW: 1,
            EDIT: 2,
            SHARE: 3,
        };
        return permissions[current] >= permissions[required];
    }

    async checkPermisison(
        folderId: string,
        userId: string,
        requiredPermission: PermissionType
    ) {
        const acl = await this.prisma.aCL.findFirst({
            where: {
                userId,
                folderId,
                folder: {
                    isDeleted: false,
                    drive: {
                        isDeleted: false,
                    },
                },
            },
            include: {
                folder: true
            }
        });

        if (!acl) throw new ForbiddenException("You don't have permission to access this folder!");

        if (!this.hasPermission(acl.permissionType, requiredPermission)) {
            throw new ForbiddenException("You do not have permission to perform this action!");
        }
        return acl;
    }

    async getSharedFolders(userId: string): Promise<FolderResponseDTO[]> {
        const folders = await this.prisma.$queryRaw<
            {
                id: string;
                folderName: string;
                parentFolderId: string | null;
                driveId: string;
                status: "SHOW" | "HIDDEN";
                createdAt: Date;
                updatedAt: Date;
                permissionType: PermissionType;
                ownerId: string;
                ownerFullName: string;
            }[]
        >`
        WITH RECURSIVE ancestors AS (
            SELECT f.id AS "folderId", f."parentFolderId" AS "ancestorId"
            FROM "Folder" f
            UNION ALL
            SELECT a."folderId", parent."parentFolderId"
            FROM ancestors a
            INNER JOIN "Folder" parent ON parent.id = a."ancestorId"
            WHERE a."ancestorId" IS NOT NULL
        )
        SELECT
            f.id, f."folderName", f."parentFolderId", f."driveId", f.status, f."createdAt", f."updatedAt",
            acl."permissionType",
            owner.id AS "ownerId",
            owner."fullName" AS "ownerFullName"
        FROM "ACL" acl
        INNER JOIN "Folder" f ON f.id = acl."folderId"
        INNER JOIN "Drive" d ON d.id = f."driveId"
        INNER JOIN "User" owner ON owner.id = d."userId"
        WHERE acl."userId" = ${userId}
            AND f."isDeleted" = false
            AND d."isDeleted" = false
            AND d."userId" != ${userId}
            AND NOT EXISTS (
                SELECT 1 FROM ancestors a
                INNER JOIN "ACL" ancestor_acl
                    ON ancestor_acl."folderId" = a."ancestorId"
                    AND ancestor_acl."userId" = ${userId}
                WHERE
                    a."folderId" = f.id
            )
    `;

        return folders.map((folder) => ({
            id: folder.id,
            folderName: folder.folderName,
            parentFolderId: folder.parentFolderId,
            driveId: folder.driveId,
            status: folder.status,
            createdAt: folder.createdAt,
            updatedAt: folder.updatedAt,
            owner: {
                id: folder.ownerId,
                fullName: folder.ownerFullName,
            },
            permissionType: folder.permissionType,
        }));
    }

    async sharedFolder(
        folderId: string,
        userId: string,
        targetUserId: string,
        permission: PermissionType
    ) {
        await this.checkPermisison(folderId, userId, PermissionType.SHARE);
        if (userId === targetUserId) throw new BadRequestException("You can't share to yourself");

        const targetUser = await this.userService.findById(targetUserId);
        if (!targetUser) throw new NotFoundException("User is not found!");

        const folder = await this.prisma.folder.findUnique({
            where: { id: folderId },
            select: {
                folderName: true
            }
        });

        if (!folder) throw new NotFoundException("Folder is not found!");

        const result = await this.prisma.$transaction(async (tx) => {
            const userACL = await tx.aCL.findUnique({
                where: {
                    userId_folderId: {
                        userId: targetUserId,
                        folderId
                    }
                }
            });
            if (!userACL) {
                const acl = await this.createACL(tx, {
                    userId: targetUserId,
                    folderId,
                    permissionType: permission
                });
                await this.activityService.createActivity(
                    tx,
                    userId,
                    folderId,
                    {
                        action: ActivityAction.SHARE,
                        metadata: {
                            targetUserId: targetUser.id,
                            targetUserName: targetUser.fullName,
                            permission,
                        }
                    }
                );
                const notification = await this.notificationService.createNotification(
                    tx,
                    targetUserId,
                    userId,
                    folderId,
                    ResourceType.FOLDER,
                    {
                        type: NotificationType.SHARE,
                        metadata: {
                            resourceName: folder.folderName,
                            permission
                        }
                    }
                );
                return {
                    acl,
                    notification
                };
            }
            if (userACL.permissionType === permission)
                throw new ConflictException("User has already permission for this folder");
            const acl = await tx.aCL.update({
                where: {
                    userId_folderId: {
                        userId: targetUserId,
                        folderId
                    }
                },
                data: {
                    permissionType: permission
                }
            });
            await this.activityService.createActivity(
                tx,
                userId,
                folderId,
                {
                    action: ActivityAction.CHANGE_PERMISSION,
                    metadata: {
                        targetUserId: targetUser.id,
                        targetUserName: targetUser.fullName,
                        oldPermission: userACL.permissionType,
                        newPermission: permission
                    }
                }
            );
            const notification = await this.notificationService.createNotification(
                tx,
                targetUserId,
                userId,
                folderId,
                ResourceType.FOLDER,
                {
                    type: NotificationType.CHANGE_PERMISSION,
                    metadata: {
                        resourceName: folder.folderName,
                        oldPermission: userACL.permissionType,
                        newPermission: permission
                    }
                }
            );
            return {
                acl,
                notification
            };
        });
        this.notificationService.sendRealtimeNotification(
            targetUserId,
            result.notification
        );
        return result.acl
    }

    async getSharedFolderChildren(
        folderId: string,
        userId: string,
    ) {
        // Kiểm tra user có được share folder cha hay không
        const acl = await this.prisma.aCL.findUnique({
            where: {
                userId_folderId: {
                    userId,
                    folderId,
                },
            },
            select: {
                permissionType: true,
            },
        });

        if (!acl) {
            throw new ForbiddenException(
                "You don't have permission to access this folder!",
            );
        }

        // Chỉ lấy những folder con trực tiếp
        // và folder con đó cũng phải được share cho user
        const folders = await this.prisma.folder.findMany({
            where: {
                parentFolderId: folderId,
                isDeleted: false,
                status: "SHOW",

                acls: {
                    some: {
                        userId,
                        isOwner: false,
                    },
                },
            },
            select: {
                id: true,
                folderName: true,
                parentFolderId: true,
                driveId: true,
                status: true,
                createdAt: true,
                updatedAt: true,

                drive: {
                    select: {
                        user: {
                            select: {
                                id: true,
                                fullName: true,
                            },
                        },
                    },
                },
            },
            orderBy: {
                createdAt: "asc",
            },
        });

        return folders.map((folder) => ({
            id: folder.id,
            folderName: folder.folderName,
            parentFolderId: folder.parentFolderId,
            driveId: folder.driveId,
            status: folder.status,
            createdAt: folder.createdAt,
            updatedAt: folder.updatedAt,
            owner: {
                id: folder.drive.user.id,
                fullName: folder.drive.user.fullName,
            },
        }));
    }

    async getFolderUsers(
        folderId: string,
        userId: string,
    ): Promise<ACLUserResponseDTO[]> {
        // Người gọi phải có quyền SHARE mới được xem danh sách người được share
        await this.checkPermisison(
            folderId,
            userId,
            PermissionType.SHARE,
        );

        const acls = await this.prisma.aCL.findMany({
            where: {
                folderId,
            },
            include: {
                user: {
                    select: {
                        id: true,
                        fullName: true,
                        email: true,
                    },
                },
            },
            orderBy: {
                createdAt: "asc",
            },
        });

        return acls.map((acl) => ({
            id: acl.user.id,
            fullName: acl.user.fullName,
            email: acl.user.email,
            permissionType: acl.permissionType,
            isOwner: acl.isOwner,
        }));
    }

}