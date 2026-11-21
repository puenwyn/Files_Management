import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { StorageService } from 'src/infrastructure/storage/storage.service';
import { DriveService } from '../drive/drive.service';
import { FolderService } from '../folder/folder.service';
import { ACLService } from '../acl/acl.service';
import { ActivityAction, NotificationType, PermissionType, ResourceType } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CompleteFileUploadDTO } from './dtos/complete-file-upload.dto';
import { CreateFileUploadDTO } from './dtos/create-file-upload.dto';
import { FileDetailResponseDTO } from './dtos/file-detail-response.dto';
import { FileResponseDTO } from './dtos/file-response.dto';
import { ActivityService } from '../activity/activity.service';
import { NotificationService } from '../notification/notification.service';

@Injectable()
export class FileService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly storageService: StorageService,
        private readonly driveService: DriveService,
        private readonly folderService: FolderService,
        private readonly aclService: ACLService,
        private readonly activityService: ActivityService,
        private readonly notificationService: NotificationService
    ) { }

    async createUpload(userId: string, dto: CreateFileUploadDTO) {
        const { driveId, parentFolderId, files } = dto;

        if (!driveId && !parentFolderId) {
            throw new BadRequestException(
                "Either driveId or parentFolderId must be provided!",
            );
        }

        if (driveId && parentFolderId) {
            throw new BadRequestException(
                "Provide either driveId or parentFolderId, not both!",
            );
        }

        if (driveId) {
            await this.driveService.checkDriveOwnership(
                driveId,
                userId,
            );
        }

        if (parentFolderId) {
            const parent = await this.prisma.folder.findUnique({
                where: { id: parentFolderId },
            });

            if (!parent) {
                throw new NotFoundException("Parent is not found!");
            }

            await this.folderService.checkFolderAccess(
                parentFolderId,
                userId,
                PermissionType.EDIT,
            );
        }

        const result = await this.prisma.$transaction(async (tx) => {
            const uploads: {
                label: string;
                fileId: string;
                fileVersionId: string;
                sha256: string;
                mimeType: string;
            }[] = [];

            for (const file of files) {
                const existingFile = await tx.file.findFirst({
                    where: {
                        name: file.name,
                        extension: file.extension,
                        driveId: driveId ?? null,
                        folderId: parentFolderId ?? null,
                    },
                });

                let fileRecord = existingFile;

                if (!fileRecord) {
                    fileRecord = await tx.file.create({
                        data: {
                            name: file.name,
                            extension: file.extension,
                            size: BigInt(file.size),
                            driveId: driveId ?? null,
                            folderId: parentFolderId ?? null,
                        },
                    });

                    await this.aclService.createACL(tx, {
                        userId,
                        fileId: fileRecord.id,
                        permissionType: PermissionType.SHARE,
                        isOwner: true,
                    });
                }

                const latestVersion = await tx.fileVersion.findFirst({
                    where: {
                        fileId: fileRecord.id,
                    },
                    orderBy: {
                        versionNumber: "desc",
                    },
                });

                const versionNumber = (latestVersion?.versionNumber ?? 0) + 1;

                let blob = await tx.physicalBlob.findUnique({
                    where: {
                        sha256: file.sha256,
                    },
                });

                if (!blob) {
                    blob = await tx.physicalBlob.create({
                        data: {
                            sha256: file.sha256,
                            relPath: `uploads/${file.sha256}`,
                            sizeBytes: BigInt(file.size),
                            refCount: 0,
                        },
                    });
                }

                const fileVersion = await tx.fileVersion.create({
                    data: {
                        fileId: fileRecord.id,
                        blobId: blob.id,
                        versionNumber,
                        mimeType: file.mimeType,
                        size: BigInt(file.size),
                        isUploaded: false,
                    },
                });

                await tx.file.update({
                    where: {
                        id: fileRecord.id,
                    },
                    data: {
                        size: BigInt(file.size),
                        latestVersionId: fileVersion.id,
                    },
                });

                uploads.push({
                    label: file.label,
                    fileId: fileRecord.id,
                    fileVersionId: fileVersion.id,
                    sha256: file.sha256,
                    mimeType: file.mimeType,
                });
            }

            return uploads;
        });

        const uploads = await Promise.all(
            result.map(async (item) => {
                const uploadUrl =
                    await this.storageService.generateUploadUrl(
                        item.sha256,
                        item.mimeType,
                    );

                return {
                    label: item.label,
                    fileId: item.fileId,
                    fileVersionId: item.fileVersionId,
                    url: uploadUrl.url,
                    objectKey: uploadUrl.objectKey,
                    expiresIn: uploadUrl.expiresIn,
                };
            }),
        );

        return {
            message: "Upload URLs generated successfully!",
            uploads,
        };
    }

    async completeUpload(userId: string, dto: CompleteFileUploadDTO) {
        const fileVersion = await this.prisma.fileVersion.findUnique({
            where: { id: dto.fileVersionId },
            include: {
                file: {
                    include: {
                        acls: {
                            where: { userId }
                        }
                    }
                },
                blob: true
            }
        });
        if (!fileVersion) throw new NotFoundException("File version is not found!");

        const userACL = fileVersion.file.acls[0];
        if (!userACL) throw new ForbiddenException("You don't have permission to access this file!");

        const objectKey = fileVersion.blob.relPath;
        const object = await this.storageService.checkObject(objectKey);

        if (!object.exists) throw new NotFoundException("Uploaded file was not found in storage!");

        if (object.size !== Number(fileVersion.size)) throw new BadRequestException(
            "Uploaded file size does not match!",
        );

        const updatedVersion = await this.prisma.$transaction(
            async (tx) => {
                const updatedVersion =
                    await tx.fileVersion.update({
                        where: {
                            id: fileVersion.id,
                        },
                        data: {
                            isUploaded: true,
                        },
                    });

                await tx.physicalBlob.update({
                    where: {
                        id: fileVersion.blobId,
                    },
                    data: {
                        refCount: {
                            increment: 1,
                        },
                    },
                });

                return updatedVersion;
            },
        );

        return {
            message: "File upload completed successfully!",
            fileVersionId: updatedVersion.id,
            isUploaded: updatedVersion.isUploaded,
        };
    }



    async getDriveFiles(userId: string, driveId: string) {
        await this.driveService.checkDriveOwnership(driveId, userId);

        const files = await this.prisma.file.findMany({
            where: {
                driveId,
                folderId: null,
                acls: {
                    some: { userId },
                },
                latestVersion: {
                    is: { isUploaded: true },
                },
            },
            include: {
                acls: {
                    where: { userId },
                    select: {
                        permissionType: true,
                        isOwner: true,
                    },
                },
                latestVersion: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        return files.map((file) => {
            const acl = file.acls[0];

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
                isOwner: acl?.isOwner ?? false,
                isAccessed: false,
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
                latestVersion: {
                    is: { isUploaded: true },
                },
            },
            include: {
                acls: {
                    where: { userId },
                    select: {
                        permissionType: true,
                        isOwner: true,
                    },
                },
                latestVersion: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        return files.map((file) => {
            const acl = file.acls[0];

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
                isOwner: acl?.isOwner ?? false,
                isAccessed: !!acl,
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
        // 1. Kiểm tra quyền xem file
        await this.aclService.checkFilePermission(
            fileId,
            userId,
            PermissionType.VIEW,
        );

        // 2. Lấy thông tin file, phiên bản mới nhất và blob
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

        // 3. Không preview file đã mã hóa
        if (latestVersion.encrypt) {
            throw new BadRequestException(
                "Encrypted files cannot be previewed!",
            );
        }

        // 4. Tạo URL xem file từ MinIO
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
