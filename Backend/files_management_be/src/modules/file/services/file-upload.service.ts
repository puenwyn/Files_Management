import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { StorageService } from "src/infrastructure/storage/storage.service";
import { ACLService } from "src/modules/acl/acl.service";
import { ActivityService } from "src/modules/activity/activity.service";
import { DriveService } from "src/modules/drive/drive.service";
import { FolderService } from "src/modules/folder/folder.service";
import { NotificationService } from "src/modules/notification/notification.service";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateFileUploadDTO } from "../dtos/create-file-upload.dto";
import { PermissionType, Prisma } from "@prisma/client";
import { CompleteFileUploadDTO } from "../dtos/complete-file-upload.dto";

@Injectable()
export class FileUploadService {

    constructor(
        private readonly prisma: PrismaService,
        private readonly storageService: StorageService,
        private readonly driveService: DriveService,
        private readonly folderService: FolderService,
        private readonly aclService: ACLService,
        private readonly activityService: ActivityService,
        private readonly notificationService: NotificationService,
    ) { }

    private async getDriveIdFromFolder(
        folderId: string,
        tx: Prisma.TransactionClient = this.prisma,
    ): Promise<string> {
        const folder = await tx.folder.findUnique({
            where: { id: folderId },
            select: { driveId: true, parentFolderId: true },
        });

        if (!folder) throw new NotFoundException("Folder not found!");

        if (folder.driveId) {
            return folder.driveId;
        }

        if (!folder.parentFolderId) {
            throw new BadRequestException(
                "Cannot determine the Drive containing this folder!",
            );
        }

        return this.getDriveIdFromFolder(
            folder.parentFolderId,
            tx,
        );
    }

    private async getFileDriveId(
        fileId: string,
        tx: Prisma.TransactionClient = this.prisma,
    ): Promise<string> {
        const file = await tx.file.findUnique({
            where: { id: fileId },
            select: {
                driveId: true,
                folderId: true,
            },
        });

        if (!file) {
            throw new NotFoundException("File not found!");
        }

        if (file.driveId) {
            return file.driveId;
        }

        if (file.folderId) {
            return this.getDriveIdFromFolder(file.folderId, tx);
        }

        throw new BadRequestException("File has no valid location!");
    }

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

        const updatedVersion = await this.prisma.$transaction(async (tx) => {
            const currentVersion = await tx.fileVersion.findUnique({
                where: { id: fileVersion.id },
                select: {
                    id: true,
                    isUploaded: true,
                    size: true,
                    fileId: true,
                },
            });

            if (!currentVersion) {
                throw new NotFoundException("File version is not found!");
            }

            if (currentVersion.isUploaded) {
                return currentVersion;
            }

            const previousVersion = await tx.fileVersion.findFirst({
                where: {
                    fileId: currentVersion.fileId,
                    isUploaded: true,
                    versionNumber: {
                        lt: fileVersion.versionNumber,
                    },
                },
                orderBy: {
                    versionNumber: "desc",
                },
                select: {
                    size: true,
                },
            });
            const driveId = await this.getFileDriveId(fileVersion.fileId, tx);

            const delta = currentVersion.size - (previousVersion?.size ?? 0n);

            const updated = await tx.fileVersion.update({
                where: {
                    id: currentVersion.id,
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

            await this.driveService.updateStorageUsage(tx, driveId, delta);
            return updated;
        });

        return {
            message: "File upload completed successfully!",
            fileVersionId: updatedVersion.id,
            isUploaded: updatedVersion.isUploaded,
        };
    }
}