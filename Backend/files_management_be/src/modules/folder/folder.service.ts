import { BadRequestException, ForbiddenException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { DriveService } from "../drive/drive.service";
import { ActivityAction, FolderStatus, Notification, NotificationType, PermissionType, ResourceType } from "@prisma/client";
import * as bcrypt from 'bcrypt';
import { FolderResponseDTO } from "./dtos/folder-response.dto";
import { ACLService } from "../acl/acl.service";
import { ActivityService } from "../activity/activity.service";
import { folderWithOwnerInclude } from "./constants/folder.include";
import { FolderWithOwner } from "./types/folder-with-owner.type";
import { NotificationService } from "../notification/notification.service";
import { FolderDetailResponseDTO } from "./dtos/folder-detail-response.dto";

@Injectable()
export class FolderService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly driveService: DriveService,
        private readonly aclService: ACLService,
        private readonly activityService: ActivityService,
        private readonly notificationService: NotificationService
    ) { }

    private mappingFolderResponse(
        folder: FolderWithOwner,
        permissionType: PermissionType | null = null
    ): FolderResponseDTO {
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
            permissionType,
        };
    }

    async checkDrive(driveId: string, userId: string) {
        return this.driveService.checkDriveOwnership(driveId, userId)
    }

    async checkFolderOwnership(folderId: string, userId: string) {
        const folder = await this.prisma.folder.findFirst({
            where: {
                id: folderId,
                isDeleted: false,
                drive: {
                    userId,
                    isDeleted: false,
                },
            },
        });

        if (!folder) throw new NotFoundException("Folder is not found!");
        return folder;
    }

    async createFolder(
        userId: string,
        driveId: string | undefined,
        parentFolderId: string | undefined,
        folderName: string
    ) {

        if (!driveId && !parentFolderId) throw new BadRequestException(
            "Either driveId or parentFolderId must be provided!"
        );

        if (driveId && parentFolderId) throw new BadRequestException(
            "Provide either driveId or parentFolderId, not both!"
        );

        if (parentFolderId) {
            const parent = await this.prisma.folder.findUnique({
                where: { id: parentFolderId },
            });
            if (!parent) throw new NotFoundException("Parent is not found!");
            await this.checkFolderAccess(parentFolderId, userId, PermissionType.EDIT,);
        } else {
            await this.checkDrive(driveId!, userId);
        }

        const result = await this.prisma.$transaction(async (tx) => {
            const folder = await tx.folder.create({
                data: {
                    folderName,
                    parentFolderId,
                    driveId: driveId
                },
            });
            await this.aclService.createACL(tx, {
                userId,
                folderId: folder.id,
                permissionType: PermissionType.SHARE,
                isOwner: true,
            });
            await this.activityService.createActivity(
                tx,
                userId,
                folder.id,
                { action: ActivityAction.CREATE, metadata: { folderName } }
            );
            let notification: Notification | undefined;
            let receiverId: string | undefined;

            if (parentFolderId) {
                const ownerACL = await tx.aCL.findFirst({
                    where: {
                        folderId: parentFolderId,
                        isOwner: true,
                    },
                    select: {
                        userId: true,
                    },
                });

                if (ownerACL && ownerACL.userId !== userId) {
                    receiverId = ownerACL.userId;

                    notification =
                        await this.notificationService.createNotification(
                            tx,
                            ownerACL.userId,
                            userId,
                            parentFolderId,
                            ResourceType.FOLDER,
                            {
                                type: NotificationType.CREATE,
                                metadata: {
                                    resourceName: folderName,
                                },
                            },
                        );
                }
            }

            return {
                folder,
                notification,
                receiverId,
            };
        });
        if (result.notification && result.receiverId) {
            this.notificationService.sendRealtimeNotification(
                result.receiverId,
                result.notification,
            );
        }
        return {
            message: "Created folder successfully"!
        };
    }

    async renameFolder(userId: string, folderId: string, newFolderName: string): Promise<FolderResponseDTO> {
        await this.checkFolderAccess(folderId, userId, PermissionType.EDIT);

        const result = await this.prisma.$transaction(async (tx) => {
            const oldFolder = await tx.folder.findUnique({
                where: { id: folderId, status: FolderStatus.SHOW, isDeleted: false }
            });
            if (!oldFolder) throw new NotFoundException("Folder is not found!");

            const folder = await tx.folder.update({
                where: { id: folderId },
                data: { folderName: newFolderName },
            });
            await this.activityService.createActivity(
                tx,
                userId,
                folderId,
                {
                    action: ActivityAction.RENAME,
                    metadata: {
                        oldName: oldFolder.folderName,
                        newName: newFolderName,
                    },
                },
            );
            const ownerACL = await tx.aCL.findFirst({
                where: {
                    folderId,
                    isOwner: true
                },
                select: {
                    userId: true
                }
            });

            let notification: Notification | undefined;

            if (ownerACL && ownerACL.userId !== userId) {
                notification = await this.notificationService.createNotification(
                    tx,
                    ownerACL.userId,
                    userId,
                    folderId,
                    ResourceType.FOLDER,
                    {
                        type: NotificationType.RENAME,
                        metadata: {
                            resourceName: newFolderName,
                            oldName: oldFolder.folderName,
                        }
                    }
                );
            }

            return {
                folder,
                notification,
                ownerId: ownerACL?.userId
            };
        });
        if (result.notification && result.ownerId) {
            this.notificationService.sendRealtimeNotification(
                result.ownerId,
                result.notification
            );
        }

        const folder = await this.prisma.folder.findUnique({
            where: { id: result.folder.id },
            include: folderWithOwnerInclude,
        });
        if (!folder) {
            throw new NotFoundException("Folder is not found!");
        }

        return this.mappingFolderResponse(folder);
    }

    private async getStarredFolderIds(userId: string) {
        const starredFolders = await this.prisma.starred.findMany({
            where: {
                userId,
                resourceType: ResourceType.FOLDER,
            },
            select: {
                resourceId: true,
            },
        });

        return starredFolders.map((item) => item.resourceId);
    }

    async getDriveFolders(userId: string, driveId: string, showHidden: boolean = false) {
        await this.checkDrive(driveId, userId);
        const folders = await this.prisma.folder.findMany({
            where: {
                parentFolderId: null,
                driveId,
                isDeleted: false,
                ...(showHidden ? {} : {
                    status: FolderStatus.SHOW,
                }),
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
            orderBy: {
                createdAt: "asc"
            }
        });

        const starredFolderIds = await this.getStarredFolderIds(userId);

        return {
            folders: folders.map((folder) => {
                const owner = folder.acls.find((acl) => acl.isOwner);
                const userACL = folder.acls.find((acl) => acl.user.id === userId);
                return {
                    id: folder.id,
                    folderName: folder.folderName,
                    parentFolderId: folder.parentFolderId,
                    driveId: folder.driveId,
                    status: folder.status,
                    createdAt: folder.createdAt,
                    updatedAt: folder.updatedAt,
                    owner: {
                        id: owner!.user.id,
                        fullName: owner!.user.fullName,
                    },
                    permissionType: userACL!.permissionType,
                    isStarred: starredFolderIds.includes(folder.id),
                };
            }),
            showHidden
        }
    }

    async getFolderChildrens(
        folderId: string,
        userId: string,
        showHidden: boolean = false,
    ) {
        await this.checkFolderAccess(
            folderId,
            userId,
            PermissionType.VIEW,
            showHidden,
        );
        const permissionType = await this.aclService.getFolderPermission(folderId, userId);

        const folders = await this.prisma.folder.findMany({
            where: {
                parentFolderId: folderId,
                isDeleted: false,
                ...(showHidden
                    ? {}
                    : {
                        status: FolderStatus.SHOW,
                    }),
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
            orderBy: {
                createdAt: "asc",
            },
        });

        const starredFolderIds = await this.getStarredFolderIds(userId);

        return {
            folders: folders.map((folder) => {
                const owner = folder.acls.find((acl) => acl.isOwner);
                const userACL = folder.acls.find((acl) => acl.userId === userId);

                if (!owner) throw new InternalServerErrorException(
                    `Folder ${folder.id} does not have an owner ACL`,
                );

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
                    permissionType: userACL?.permissionType,
                    isAccessed: !!userACL,
                    isStarred: starredFolderIds.includes(folder.id),
                };
            }),
            permissionType: permissionType,
            showHidden,
        };
    }

    async checkFolderAccess(
        folderId: string,
        userId: string,
        requiredPermission: PermissionType,
        showHidden: boolean = false
    ) {
        const acl = await this.aclService.checkPermisison(folderId, userId, requiredPermission);

        const folder = acl.folder;
        if (showHidden && !acl.isOwner)
            throw new ForbiddenException("Only the owner can access hidden folders!");

        const hasDeletedAncestor = await this.hasDeletedAncestor(folderId);

        if (hasDeletedAncestor)
            throw new NotFoundException("Folder is not found!");

        if (!showHidden) {
            const hasHiddenAncestor = await this.hasHiddenAncestor(folderId);

            if (
                acl.folder.status === FolderStatus.HIDDEN ||
                hasHiddenAncestor
            ) {
                throw new ForbiddenException("This folder is private!");
            }
        }

        return folder;
    }

    async hasHiddenAncestor(folderId: string): Promise<boolean> {
        const result = await this.prisma.$queryRaw<{ exists: boolean }[]>`
            WITH RECURSIVE ancestors AS (
                SELECT "parentFolderId", "status"
                FROM "Folder"
                WHERE "id" = ${folderId}
                UNION ALL
                SELECT f."parentFolderId", f."status"
                FROM "Folder" f INNER JOIN ancestors a ON f."id" = a."parentFolderId"
            )
            SELECT EXISTS (
                SELECT 1
                FROM ancestors
                WHERE "status" = 'HIDDEN'
            ) AS "exists"
        `;
        return result[0].exists;
    }

    async hideFolder(userId: string, folderId: string, password: string): Promise<FolderResponseDTO> {
        await this.checkFolderOwnership(folderId, userId);
        const passwordHash = await bcrypt.hash(password, 10,);

        const folder = await this.prisma.folder.update({
            where: {
                id: folderId,
            },
            data: {
                status: FolderStatus.HIDDEN,
                passwordHash,
            },
            include: folderWithOwnerInclude,
        });
        return this.mappingFolderResponse(folder);
    }

    async showFolder(userId: string, folderId: string, password: string): Promise<FolderResponseDTO> {
        const folder = await this.checkFolderOwnership(folderId, userId);
        if (!folder.passwordHash) throw new BadRequestException("Password is not set!");

        const isValid = await bcrypt.compare(password, folder.passwordHash);
        if (!isValid) throw new UnauthorizedException("Password is not valid!");

        const folderShow = await this.prisma.folder.update({
            where: {
                id: folderId,
            },
            data: {
                status: FolderStatus.SHOW,
                passwordHash: null
            },
            include: folderWithOwnerInclude,
        });
        return this.mappingFolderResponse(folderShow);
    }

    async hasDeletedAncestor(folderId: string): Promise<boolean> {
        const result = await this.prisma.$queryRaw<{ exists: boolean }[]>`
            WITH RECURSIVE ancestors AS (
                SELECT parent."parentFolderId", parent."isDeleted"
                FROM "Folder" current
                INNER JOIN "Folder" parent ON parent."id" = current."parentFolderId"
                WHERE current."id" = ${folderId}
                UNION ALL
                SELECT parent."parentFolderId", parent."isDeleted"
                FROM "Folder" parent
                INNER JOIN ancestors a ON parent."id" = a."parentFolderId"
            )
            SELECT EXISTS (
                SELECT 1 FROM ancestors WHERE "isDeleted" = true
            ) AS "exists"
        `;
        return result[0].exists;
    }

    async deleteFolder(userId: string, folderId: string): Promise<FolderResponseDTO> {
        await this.checkFolderAccess(
            folderId,
            userId,
            PermissionType.EDIT
        );
        const folder = await this.prisma.folder.update({
            where: {
                id: folderId,
            },
            data: {
                isDeleted: true,
            },
            include: folderWithOwnerInclude,
        });

        return this.mappingFolderResponse(folder);
    }

    async getTrash(userId: string): Promise<FolderResponseDTO[]> {
        const folders = await this.prisma.folder.findMany({
            where: {
                isDeleted: true,
                drive: {
                    userId,
                    isDeleted: false,
                },
            },
            orderBy: {
                updatedAt: "desc",
            },
            include: folderWithOwnerInclude,
        });

        return folders.map((folder) => this.mappingFolderResponse(folder));
    }

    async getFolderPath(
        folderId: string,
        userId: string
    ) {
        await this.checkFolderAccess(
            folderId,
            userId,
            PermissionType.VIEW
        );

        const result = await this.prisma.$queryRaw<
            {
                id: string;
                folderName: string;
                parentFolderId: string | null;
                driveId: string;
            }[]
        >`
        WITH RECURSIVE ancestors AS (
            SELECT "id", "folderName", "parentFolderId", "driveId"
            FROM "Folder"
            WHERE "id" = ${folderId}

            UNION ALL

            SELECT f."id", f."folderName", f."parentFolderId", f."driveId"
            FROM "Folder" f
            INNER JOIN ancestors a
                ON f."id" = a."parentFolderId"
        )
        SELECT "id", "folderName", "parentFolderId", "driveId"
        FROM ancestors;
    `;

        const folders = result.reverse();

        const sharedFolders = await this.aclService.getSharedFolders(userId);

        const sharedFolderIds = new Set(
            sharedFolders.map((folder) => folder.id)
        );

        const sharedRootIndex = folders.findIndex((folder) =>
            sharedFolderIds.has(folder.id)
        );

        const isShared = sharedRootIndex !== -1;

        const visibleFolders = isShared
            ? folders.slice(sharedRootIndex)
            : folders;

        return {
            driveId: folders[0].driveId,
            isShared,
            folders: visibleFolders.map((folder) => ({
                id: folder.id,
                folderName: folder.folderName,
            })),
        };
    }

    async getFolderDetail(
        userId: string,
        folderId: string
    ): Promise<FolderDetailResponseDTO> {
        await this.checkFolderAccess(
            folderId,
            userId,
            PermissionType.VIEW
        );
        const folder = await this.prisma.folder.findFirst({
            where: { id: folderId, isDeleted: false, },
            include: {
                acls: {
                    orderBy: { createdAt: "asc", },
                    include: {
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

        if (!folder) {
            throw new NotFoundException("Folder not found");
        }

        const owner = folder.acls.find((acl) => acl.isOwner);

        if (!owner) {
            throw new NotFoundException("Folder owner not found");
        }

        return {
            id: folder.id,
            folderName: folder.folderName,
            driveId: folder.driveId,
            createdAt: folder.createdAt,
            updatedAt: folder.updatedAt,
            owner: {
                id: owner.user.id,
                fullName: owner.user.fullName,
                permissionType: owner.permissionType,
                isOwner: true,
            },
            users: folder.acls
                .filter((acl) => !acl.isOwner)
                .map((acl) => ({
                    id: acl.user.id,
                    fullName: acl.user.fullName,
                    permissionType: acl.permissionType,
                    isOwner: false,
                })),
        };
    }

    async restoreFolder(userId: string, folderId: string): Promise<FolderResponseDTO> {
        const folder = await this.prisma.folder.findFirst({
            where: {
                id: folderId,
                isDeleted: true,
                drive: { userId, isDeleted: false },
            },
        });
        if (!folder) throw new NotFoundException("Folder is not found!");
        const hasDeletedAncestor = await this.hasDeletedAncestor(folderId);
        if (hasDeletedAncestor) {
            throw new BadRequestException(
                "Cannot restore folder because its parent folder is deleted!"
            );
        }

        const restoredFolder = await this.prisma.folder.update({
            where: {
                id: folderId,
            },
            data: {
                isDeleted: false,
            },
            include: folderWithOwnerInclude,
        });

        return this.mappingFolderResponse(restoredFolder);
    }
}