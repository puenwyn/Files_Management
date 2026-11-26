import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { StorageService } from "src/infrastructure/storage/storage.service";
import { ACLService } from "src/modules/acl/acl.service";
import { ActivityService } from "src/modules/activity/activity.service";
import { DriveService } from "src/modules/drive/drive.service";
import { FolderService } from "src/modules/folder/folder.service";
import { NotificationService } from "src/modules/notification/notification.service";
import { PrismaService } from "src/prisma/prisma.service";
import { FileResponseDTO } from "../dtos/file-response.dto";
import { ActivityAction, NotificationType, PermissionType, ResourceType } from "@prisma/client";

@Injectable()
export class FileMutationService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly storageService: StorageService,
        private readonly driveService: DriveService,
        private readonly folderService: FolderService,
        private readonly aclService: ACLService,
        private readonly activityService: ActivityService,
        private readonly notificationService: NotificationService
    ) { }

    async renameFile(userId: string, fileId: string, newName: string): Promise<FileResponseDTO> {
        await this.aclService.checkFilePermission(fileId, userId, PermissionType.EDIT);

        const oldFile = await this.prisma.file.findUnique({
            where: { id: fileId },
        });

        if (!oldFile) {
            throw new NotFoundException("File is not found!");
        }

        const trimmedName = newName.trim();

        if (!trimmedName) {
            throw new BadRequestException("File name cannot be empty!");
        }

        const result = await this.prisma.$transaction(async (tx) => {
            const existingFiles = await tx.file.findMany({
                where: {
                    driveId: oldFile.driveId,
                    folderId: oldFile.folderId,
                    extension: oldFile.extension,
                    id: { not: fileId },
                },
                select: { name: true },
            });

            const existingNames = new Set(
                existingFiles.map((file) => file.name),
            );

            let finalName = trimmedName;

            for (let counter = 1; existingNames.has(finalName); counter++) {
                finalName = `${trimmedName} (${counter})`;
            }

            const file = await tx.file.update({
                where: { id: fileId },
                data: { name: finalName },
            });

            await this.activityService.createActivity(
                tx,
                userId,
                fileId,
                ResourceType.FILE,
                {
                    action: ActivityAction.RENAME,
                    metadata: {
                        oldName: oldFile.name,
                        newName: finalName,
                    },
                },
            );

            const ownerACL = await tx.aCL.findFirst({
                where: { fileId, isOwner: true },
                select: { userId: true },
            });

            const notification =
                ownerACL && ownerACL.userId !== userId
                    ? await this.notificationService.createNotification(
                        tx,
                        ownerACL.userId,
                        userId,
                        fileId,
                        ResourceType.FILE,
                        {
                            type: NotificationType.RENAME,
                            metadata: {
                                resourceName: finalName,
                                oldName: oldFile.name,
                            },
                        },
                    )
                    : undefined;

            return {
                file,
                notification,
                ownerId: ownerACL?.userId,
            };
        });

        if (result.notification && result.ownerId) {
            this.notificationService.sendRealtimeNotification(
                result.ownerId,
                result.notification,
            );
        }

        const file = await this.prisma.file.findUnique({
            where: { id: fileId },
            include: {
                acls: {
                    where: { isOwner: true },
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

        if (!file) {
            throw new NotFoundException("File is not found!");
        }

        const owner = file.acls[0];

        if (!owner) {
            throw new NotFoundException("File owner not found!");
        }

        return {
            id: file.id,
            name: file.name,
            extension: file.extension,
            driveId: file.driveId,
            folderId: file.folderId,
            status: file.status,
            size: file.size.toString(),
            createdAt: file.createdAt,
            updatedAt: file.updatedAt,
            owner: {
                id: owner.user.id,
                fullName: owner.user.fullName,
            },
            permissionType: owner.permissionType,
        };
    }

    async deleteFile(
        userId: string,
        fileId: string
    ): Promise<FileResponseDTO> {
        await this.aclService.checkFilePermission(
            fileId,
            userId,
            PermissionType.EDIT
        );

        const file = await this.prisma.file.update({
            where: { id: fileId },
            data: {
                isDeleted: true,
            },
            include: {
                acls: {
                    where: { isOwner: true },
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

        const owner = file.acls[0];

        if (!owner) {
            throw new NotFoundException("File owner not found!");
        }

        return {
            id: file.id,
            name: file.name,
            extension: file.extension,
            driveId: file.driveId,
            folderId: file.folderId,
            status: file.status,
            size: file.size.toString(),
            createdAt: file.createdAt,
            updatedAt: file.updatedAt,
            owner: {
                id: owner.user.id,
                fullName: owner.user.fullName,
            },
            permissionType: owner.permissionType,
        };
    }

    async restoreFile(
        userId: string,
        fileId: string,
    ): Promise<FileResponseDTO> {
        const file = await this.prisma.file.findUnique({
            where: { id: fileId },
            include: {
                acls: {
                    where: { isOwner: true },
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

        if (!file) {
            throw new NotFoundException("File not found!");
        }

        const owner = file.acls[0];

        if (!owner || owner.user.id !== userId) {
            throw new ForbiddenException(
                "You do not have permission to restore this file!",
            );
        }

        if (!file.isDeleted) {
            throw new BadRequestException("File is not deleted!");
        }

        // Kiểm tra folder cha nếu file nằm trong folder
        if (file.folderId) {
            await this.folderService.checkFolderAccess(
                file.folderId,
                userId,
                PermissionType.EDIT,
            );
        }

        const restoredFile = await this.prisma.file.update({
            where: { id: fileId },
            data: {
                isDeleted: false,
            },
            include: {
                acls: {
                    where: { isOwner: true },
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

        const restoredOwner = restoredFile.acls[0];

        return {
            id: restoredFile.id,
            name: restoredFile.name,
            extension: restoredFile.extension,
            driveId: restoredFile.driveId,
            folderId: restoredFile.folderId,
            status: restoredFile.status,
            size: restoredFile.size.toString(),
            createdAt: restoredFile.createdAt,
            updatedAt: restoredFile.updatedAt,
            owner: {
                id: restoredOwner.user.id,
                fullName: restoredOwner.user.fullName,
            },
            permissionType: restoredOwner.permissionType,
        };
    }
}