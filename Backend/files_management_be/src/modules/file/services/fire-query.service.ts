import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { PermissionType } from "@prisma/client";
import { StorageService } from "src/infrastructure/storage/storage.service";
import { ACLService } from "src/modules/acl/acl.service";
import { ActivityService } from "src/modules/activity/activity.service";
import { DriveService } from "src/modules/drive/drive.service";
import { FolderService } from "src/modules/folder/folder.service";
import { NotificationService } from "src/modules/notification/notification.service";
import { PrismaService } from "src/prisma/prisma.service";
import { FileDetailResponseDTO } from "../dtos/file-detail-response.dto";
import { FileResponseDTO } from "../dtos/file-response.dto";

@Injectable()
export class FileQueryService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly storageService: StorageService,
        private readonly driveService: DriveService,
        private readonly folderService: FolderService,
        private readonly aclService: ACLService,
        private readonly activityService: ActivityService,
        private readonly notificationService: NotificationService
    ) { }

    async getDriveFiles(userId: string, driveId: string) {
        await this.driveService.checkDriveOwnership(driveId, userId);

        const files = await this.prisma.file.findMany({
            where: {
                driveId,
                folderId: null,
                isDeleted: false,
                acls: {
                    some: { userId },
                },
                latestVersion: {
                    is: { isUploaded: true },
                },
            },
            include: {
                acls: {
                    where: {
                        OR: [
                            { userId },
                            { isOwner: true },
                        ],
                    },
                    include: {
                        user: {
                            select: {
                                id: true,
                                fullName: true,
                            },
                        },
                    },
                },
                latestVersion: true,
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        return files.map((file) => {
            const acl = file.acls.find(
                (item) => item.userId === userId,
            );

            const owner = file.acls.find(
                (item) => item.isOwner,
            );

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
                latestVersion: file.latestVersion
                    ? {
                        ...file.latestVersion,
                        size: file.latestVersion.size.toString(),
                    }
                    : null,
                createdAt: file.createdAt,
                updatedAt: file.updatedAt,
                accessedAt: file.accessedAt,
                permissionType: acl?.permissionType ?? null,
                isAccessed: false,
                owner: {
                    id: owner.user.id,
                    fullName: owner.user.fullName,
                },
            };
        });
    }


    async getFolderFiles(userId: string, parentFolderId: string) {
        await this.folderService.checkFolderAccess(
            parentFolderId,
            userId,
            PermissionType.VIEW,
        );

        const files = await this.prisma.file.findMany({
            where: {
                folderId: parentFolderId,
                isDeleted: false,
                latestVersion: {
                    is: { isUploaded: true },
                },
            },
            include: {
                acls: {
                    where: {
                        OR: [
                            { userId },
                            { isOwner: true },
                        ],
                    },
                    include: {
                        user: {
                            select: {
                                id: true,
                                fullName: true,
                            },
                        },
                    },
                },
                latestVersion: true,
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        return files.map((file) => {
            const acl = file.acls.find(
                (item) => item.userId === userId,
            );

            const owner = file.acls.find(
                (item) => item.isOwner,
            );

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
                latestVersion: file.latestVersion
                    ? {
                        ...file.latestVersion,
                        size: file.latestVersion.size.toString(),
                    }
                    : null,
                createdAt: file.createdAt,
                updatedAt: file.updatedAt,
                accessedAt: file.accessedAt,
                permissionType: acl?.permissionType ?? PermissionType.VIEW,
                isAccessed: !!acl,
                owner: {
                    id: owner.user.id,
                    fullName: owner.user.fullName,
                },
            };
        });
    }

    async getFileDetail(userId: string, fileId: string): Promise<FileDetailResponseDTO> {
        await this.aclService.checkFilePermission(
            fileId,
            userId,
            PermissionType.VIEW,
        );

        const file = await this.prisma.file.findUnique({
            where: {
                id: fileId,
            },
            include: {
                acls: {
                    orderBy: {
                        createdAt: "asc",
                    },
                    include: {
                        user: {
                            select: {
                                id: true,
                                fullName: true,
                            },
                        },
                    },
                },
                latestVersion: true,
            },
        });

        if (!file) {
            throw new NotFoundException("File not found");
        }

        const owner = file.acls.find((acl) => acl.isOwner);

        if (!owner) {
            throw new NotFoundException("File owner not found");
        }

        const latestVersion = file.latestVersion;

        return {
            id: file.id,
            name: file.name,
            extension: file.extension,
            mimeType: latestVersion?.mimeType ?? "",
            size: latestVersion?.size.toString() ?? "0",
            driveId: file.driveId,
            folderId: file.folderId,
            status: file.status,
            previewUrl: null,
            createdAt: file.createdAt,
            updatedAt: file.updatedAt,
            accessedAt: file.accessedAt,
            owner: {
                id: owner.user.id,
                fullName: owner.user.fullName,
                permissionType: owner.permissionType,
                isOwner: true,
            },
            users: file.acls
                .filter((acl) => !acl.isOwner)
                .map((acl) => ({
                    id: acl.user.id,
                    fullName: acl.user.fullName,
                    permissionType: acl.permissionType,
                    isOwner: false,
                })),
        };
    }

    async getFilePreview(userId: string, fileId: string) {
        await this.aclService.checkFilePermission(
            fileId,
            userId,
            PermissionType.VIEW,
        );

        const file = await this.prisma.file.findUnique({
            where: {
                id: fileId,
            },
            include: {
                latestVersion: {
                    include: {
                        blob: true,
                    },
                },
            },
        });

        if (!file) {
            throw new NotFoundException("File not found!");
        }

        const latestVersion = file.latestVersion;

        if (!latestVersion || !latestVersion.isUploaded) {
            throw new NotFoundException("File has not been uploaded!");
        }

        if (latestVersion.encrypt) {
            throw new BadRequestException(
                "Encrypted files cannot be previewed!",
            );
        }

        const preview = await this.storageService.generatePreviewURL(
            latestVersion.blob.relPath,
        );

        return {
            fileId: file.id,
            name: file.name,
            extension: file.extension,
            mimeType: latestVersion.mimeType,
            url: preview.url,
            expiresIn: preview.expiresIn,
        };
    }



    async getTrash(userId: string): Promise<FileResponseDTO[]> {
        const files = await this.prisma.file.findMany({
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
            include: {
                acls: {
                    where: {
                        isOwner: true,
                    },
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

        return files.map((file) => {
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
        });
    }
}
