import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { StorageService } from 'src/infrastructure/storage/storage.service';
import { DriveService } from '../drive/drive.service';
import { FolderService } from '../folder/folder.service';
import { ACLService } from '../acl/acl.service';
import { PermissionType } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CompleteFileUploadDTO } from './dtos/complete-file-upload.dto';
import { CreateFileUploadDTO } from './dtos/create-file-upload.dto';

@Injectable()
export class FileService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly storageService: StorageService,
        private readonly driveService: DriveService,
        private readonly folderService: FolderService,
        private readonly aclService: ACLService
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
                    some: {
                        userId,
                    },
                },
                latestVersion: {
                    is: {
                        isUploaded: true,
                    },
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

        return files.map((file) => ({
            ...file,
            size: file.size.toString(),
            permissionType: file.acls[0]?.permissionType ?? null,
            isOwner: file.acls[0]?.isOwner ?? false,
            acls: undefined,
        }));
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
                    is: {
                        isUploaded: true,
                    },
                },
                OR: [
                    // User có ACL riêng trên file.
                    {
                        acls: {
                            some: { userId },
                        },
                    },
                    // User không có ACL riêng, kế thừa quyền folder.
                    {
                        acls: {
                            none: { userId },
                        },
                    },
                ],
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

        return files.map((file) => ({
            ...file,
            size: file.size.toString(),
            permissionType:
                file.acls[0]?.permissionType ?? PermissionType.VIEW,
            isOwner: file.acls[0]?.isOwner ?? false,
            isAccessed: file.acls.length > 0,
            acls: undefined,
        }));
    }

}
