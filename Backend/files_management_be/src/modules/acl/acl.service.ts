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
            folderId?: string;
            fileId?: string;
            permissionType: PermissionType;
            isOwner?: boolean;
        },
    ) {
        if (!data.folderId && !data.fileId) {
            throw new BadRequestException(
                "Either folderId or fileId must be provided!",
            );
        }

        if (data.folderId && data.fileId) {
            throw new BadRequestException(
                "Provide either folderId or fileId, not both!",
            );
        }

        return tx.aCL.create({
            data: {
                userId: data.userId,
                folderId: data.folderId,
                fileId: data.fileId,
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

    async getFolderPermission(
        folderId: string,
        userId: string,
    ) {
        const acl = await this.prisma.aCL.findFirst({
            where: {
                folderId,
                userId,
            },
            select: {
                permissionType: true,
            },
        });

        return acl?.permissionType;
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
        WITH RECURSIVE folder_roots AS (
            SELECT f.id AS "folderId", f.id AS "rootFolderId" FROM "Folder" f
            WHERE f."parentFolderId" IS NULL

            UNION ALL

            SELECT child.id AS "folderId", fr."rootFolderId" FROM "Folder" child
            INNER JOIN folder_roots fr ON child."parentFolderId" = fr."folderId"
        ),

        ancestors AS (
            SELECT f.id AS "folderId", f."parentFolderId" AS "ancestorId" FROM "Folder" f

            UNION ALL

            SELECT a."folderId", parent."parentFolderId"
            FROM ancestors a
            INNER JOIN "Folder" parent ON parent.id = a."ancestorId"
            WHERE a."ancestorId" IS NOT NULL
        )

        SELECT f.id, f."folderName", f."parentFolderId", root."driveId", f.status, f."createdAt", f."updatedAt",
            acl."permissionType", owner.id AS "ownerId", owner."fullName" AS "ownerFullName"
        FROM "ACL" acl

        INNER JOIN "Folder" f ON f.id = acl."folderId"
        INNER JOIN folder_roots fr ON fr."folderId" = f.id
        INNER JOIN "Folder" root ON root.id = fr."rootFolderId"
        INNER JOIN "Drive" d ON d.id = root."driveId"
        INNER JOIN "User" owner ON owner.id = d."userId"
        WHERE acl."userId" = ${userId} AND f."isDeleted" = false AND d."isDeleted" = false
            AND d."userId" != ${userId}
            AND NOT EXISTS (
                SELECT 1
                FROM "ACL" parent_acl
                WHERE parent_acl."folderId" = f."parentFolderId"
                AND parent_acl."userId" = ${userId}
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
                    ResourceType.FOLDER,
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
                ResourceType.FOLDER,
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
        const acl = await this.prisma.aCL.findUnique({
            where: {
                userId_folderId: { userId, folderId },
            },
            select: { permissionType: true },
        });

        if (!acl) throw new ForbiddenException(
            "You don't have permission to access this folder!",
        );

        const folders = await this.prisma.folder.findMany({
            where: {
                parentFolderId: folderId,
                isDeleted: false,
                status: "SHOW",
                acls: {
                    some: { userId, isOwner: false, },
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
                acls: {
                    where: { isOwner: true, },
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

        return folders.map((folder) => {
            const owner = folder.acls[0];
            return {
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
            };
        });
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


    async getFilePermission(fileId: string, userId: string) {
        return this.prisma.aCL.findFirst({
            where: { fileId, userId },
        });
    }

    async checkFilePermission(
        fileId: string,
        userId: string,
        requiredPermission: PermissionType,
    ) {
        const file = await this.prisma.file.findUnique({
            where: { id: fileId },
            select: {
                id: true,
                folderId: true,
            },
        });

        if (!file) throw new NotFoundException('File not found');

        const fileACL = await this.getFilePermission(fileId, userId);

        if (fileACL) {
            if (!this.hasPermission(fileACL.permissionType, requiredPermission)) {
                throw new ForbiddenException();
            }

            return fileACL;
        }

        // Nếu không có ACL file, kiểm tra folder chứa trực tiếp
        if (file.folderId) {
            const folderACL = await this.getFolderPermission(
                file.folderId,
                userId,
            );

            if (
                folderACL &&
                requiredPermission === PermissionType.VIEW
            ) {
                return folderACL;
            }
        }

        throw new ForbiddenException();
    }

    async sharedFile(
        fileId: string,
        userId: string,
        targetUserId: string,
        permission: PermissionType
    ) {
        const file = await this.prisma.file.findUnique({
            where: { id: fileId },
            select: {
                id: true,
                name: true,
            },
        });

        if (!file) throw new NotFoundException("File is not found!");
        const ownerACL = await this.getFilePermission(fileId, userId);

        if (!ownerACL || !this.hasPermission(ownerACL.permissionType, PermissionType.SHARE)) {
            throw new ForbiddenException(
                "You don't have permission to share this file!",
            );
        }

        if (userId === targetUserId) throw new BadRequestException("You can't share to yourself");

        const targetUser = await this.userService.findById(targetUserId);
        if (!targetUser) throw new NotFoundException("User is not found!");

        const result = await this.prisma.$transaction(async (tx) => {
            const userACL = await tx.aCL.findUnique({
                where: {
                    userId_fileId: {
                        userId: targetUserId,
                        fileId,
                    },
                },
            });

            if (!userACL) {
                const acl = await this.createACL(tx, {
                    userId: targetUserId,
                    fileId,
                    permissionType: permission,
                });

                await this.activityService.createActivity(
                    tx,
                    userId,
                    fileId,
                    ResourceType.FILE,
                    {
                        action: ActivityAction.SHARE,
                        metadata: {
                            targetUserId: targetUser.id,
                            targetUserName: targetUser.fullName,
                            permission,
                        },
                    },
                );

                const notification =
                    await this.notificationService.createNotification(
                        tx,
                        targetUserId,
                        userId,
                        fileId,
                        ResourceType.FILE,
                        {
                            type: NotificationType.SHARE,
                            metadata: {
                                resourceName: file.name,
                                permission,
                            },
                        },
                    );

                return { acl, notification };
            }

            if (userACL.permissionType === permission) {
                throw new ConflictException(
                    "User has already permission for this file",
                );
            }

            const acl = await tx.aCL.update({
                where: {
                    userId_fileId: {
                        userId: targetUserId,
                        fileId,
                    },
                },
                data: {
                    permissionType: permission,
                },
            });

            await this.activityService.createActivity(
                tx,
                userId,
                fileId,
                ResourceType.FILE,
                {
                    action: ActivityAction.CHANGE_PERMISSION,
                    metadata: {
                        targetUserId: targetUser.id,
                        targetUserName: targetUser.fullName,
                        oldPermission: userACL.permissionType,
                        newPermission: permission,
                    },
                },
            );

            const notification =
                await this.notificationService.createNotification(
                    tx,
                    targetUserId,
                    userId,
                    fileId,
                    ResourceType.FILE,
                    {
                        type: NotificationType.CHANGE_PERMISSION,
                        metadata: {
                            resourceName: file.name,
                            oldPermission: userACL.permissionType,
                            newPermission: permission,
                        },
                    },
                );

            return { acl, notification };
        });

        this.notificationService.sendRealtimeNotification(
            targetUserId,
            result.notification,
        );

        return result.acl;
    }

    async getSharedFiles(userId: string) {
        const files = await this.prisma.$queryRaw<
            {
                id: string;
                name: string;
                folderId: string | null;
                driveId: string;
                createdAt: Date;
                updatedAt: Date;
                permissionType: PermissionType;
                ownerId: string;
                ownerFullName: string;
            }[]
        >`
        SELECT 
            f.id,
            f.name,
            f."folderId",
            f."driveId",
            f."createdAt",
            f."updatedAt",
            shared_acl."permissionType",
            owner_acl."userId" AS "ownerId",
            owner."fullName" AS "ownerFullName"

        FROM "ACL" shared_acl

        INNER JOIN "File" f
            ON f.id = shared_acl."fileId"

        -- Lấy ACL của owner file
        INNER JOIN "ACL" owner_acl
            ON owner_acl."fileId" = f.id
            AND owner_acl."isOwner" = true

        INNER JOIN "User" owner
            ON owner.id = owner_acl."userId"

        WHERE
            shared_acl."userId" = ${userId}
            AND shared_acl."isOwner" = false

            -- Không hiển thị file nếu folder cha được share trực tiếp
            AND NOT EXISTS (
                SELECT 1
                FROM "ACL" parent_acl
                WHERE
                    parent_acl."folderId" = f."folderId"
                    AND parent_acl."userId" = ${userId}
                    AND parent_acl."isOwner" = false
            )

        ORDER BY f."createdAt" DESC
    `;

        return files.map((file) => ({
            id: file.id,
            name: file.name,
            folderId: file.folderId,
            driveId: file.driveId,
            createdAt: file.createdAt,
            updatedAt: file.updatedAt,
            owner: {
                id: file.ownerId,
                fullName: file.ownerFullName,
            },
            permissionType: file.permissionType,
            resourceType: ResourceType.FILE,
        }));
    }
}