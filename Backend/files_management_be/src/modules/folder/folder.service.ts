import { BadRequestException, ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { DriveService } from "../drive/drive.service";
import { FolderStatus, PermissionType } from "@prisma/client";
import * as bcrypt from 'bcrypt';
import { FolderResponseDTO } from "./dtos/folder-response.dto";

@Injectable()
export class FolderService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly driveService: DriveService
    ) { }

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

    async checkParentFolder(parentFolderId: string, driveId: string) {
        const parentFolder = await this.prisma.folder.findFirst({
            where: {
                id: parentFolderId,
                driveId,
                isDeleted: false
            }
        });
        if (!parentFolder) throw new NotFoundException("Parent folder is not found!");
        return parentFolder;
    }

    async createFolder(
        userId: string,
        driveId: string,
        parentFolderId: string | undefined,
        folderName: string
    ) {
        await this.checkDrive(driveId, userId);

        if (parentFolderId) {
            await this.checkParentFolder(
                parentFolderId,
                driveId,
            );
        }

        return this.prisma.$transaction(async (tx) => {
            const folder = await tx.folder.create({
                data: {
                    folderName,
                    parentFolderId,
                    driveId
                },
            });
            await tx.aCL.create({
                data: {
                    userId,
                    folderId: folder.id,
                    permissionType: "SHARE",
                    isOwner: true,
                }
            });
            return folder;
        })
    }

    async renameFolder(userId: string, folderId: string, newFolderName: string): Promise<FolderResponseDTO> {
        await this.checkFolderPermission(folderId, userId, PermissionType.EDIT);
        const folder = await this.prisma.folder.update({
            where: {
                id: folderId
            },
            data: {
                folderName: newFolderName
            },
            include: {
                drive: {
                    include: {
                        user: {
                            select: { id: true, fullName: true },
                        },
                    },
                },
            },
        });
        return {
            id: folder.id,
            folderName: folder.folderName,
            parentFolderId: folder.parentFolderId,
            driveId: folder.driveId,
            status: folder.status,
            createdAt: folder.createdAt,
            updatedAt: folder.updatedAt,
            owner: {
                id: folder.drive.user.id,
                fullName: folder.drive.user.fullName
            },
        };
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
                drive: {
                    include: {
                        user: {
                            select: { id: true, fullName: true },
                        },
                    },
                },
            },
            orderBy: {
                createdAt: "asc"
            }
        });
        return {
            folders: folders.map((folder) => ({
                id: folder.id,
                folderName: folder.folderName,
                parentFolderId: folder.parentFolderId,
                driveId: folder.driveId,
                status: folder.status,
                createdAt: folder.createdAt,
                updatedAt: folder.updatedAt,
                owner: {
                    id: folder.drive.user.id,
                    fullName: folder.drive.user.fullName
                }
            })),
            showHidden
        }
    }

    async getFolderChildrens(folderId: string, userId: string, showHidden: boolean = false) {
        await this.checkFolderPermission(folderId, userId, PermissionType.VIEW, showHidden);
        const folders = await this.prisma.folder.findMany({
            where: {
                parentFolderId: folderId,
                isDeleted: false,
                ...(showHidden ? {} : {
                    status: FolderStatus.SHOW,
                }),
            },
            include: {
                drive: {
                    include: {
                        user: {
                            select: { id: true, fullName: true },
                        },
                    },
                },
            },
            orderBy: {
                createdAt: "asc"
            }
        });
        return {
            folders: folders.map((folder) => ({
                id: folder.id,
                folderName: folder.folderName,
                parentFolderId: folder.parentFolderId,
                driveId: folder.driveId,
                status: folder.status,
                createdAt: folder.createdAt,
                updatedAt: folder.updatedAt,
                owner: {
                    id: folder.drive.user.id,
                    fullName: folder.drive.user.fullName
                }
            })),
            showHidden
        }
    }

    private hasPermission(current: PermissionType, required: PermissionType): boolean {
        const permissions = {
            VIEW: 1,
            EDIT: 2,
            SHARE: 3,
        };
        return permissions[current] >= permissions[required];
    }

    async checkFolderPermission(
        folderId: string,
        userId: string,
        requiredPermission: PermissionType,
        showHidden: boolean = false
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
        if (!acl || acl.folder.isDeleted)
            throw new NotFoundException("Folder is not found!");

        if (!this.hasPermission(acl.permissionType, requiredPermission))
            throw new ForbiddenException("You are forbidden!");

        const hasDeletedAncestor = await this.hasDeletedAncestor(folderId);

        if (hasDeletedAncestor) {
            throw new NotFoundException("Folder is not found!");
        }
        if (!showHidden) {
            const hasHiddenAncestor = await this.hasHiddenAncestor(folderId);

            if (
                acl.folder.status === FolderStatus.HIDDEN ||
                hasHiddenAncestor
            ) {
                throw new ForbiddenException("This folder is private!");
            }
        }

        return acl.folder;
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
            include: {
                drive: {
                    include: {
                        user: {
                            select: { id: true, fullName: true },
                        },
                    },
                },
            },
        });
        return {
            id: folder.id,
            folderName: folder.folderName,
            parentFolderId: folder.parentFolderId,
            driveId: folder.driveId,
            status: folder.status,
            createdAt: folder.createdAt,
            updatedAt: folder.updatedAt,
            owner: {
                id: folder.drive.user.id,
                fullName: folder.drive.user.fullName
            },
        };
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
            include: {
                drive: {
                    include: {
                        user: {
                            select: { id: true, fullName: true },
                        },
                    },
                },
            },
        });
        return {
            id: folderShow.id,
            folderName: folderShow.folderName,
            parentFolderId: folderShow.parentFolderId,
            driveId: folderShow.driveId,
            status: folderShow.status,
            createdAt: folderShow.createdAt,
            updatedAt: folderShow.updatedAt,
            owner: {
                id: folderShow.drive.user.id,
                fullName: folderShow.drive.user.fullName,
            },
        };
    }

    async hasDeletedAncestor(folderId: string): Promise<boolean> {
        const result = await this.prisma.$queryRaw<{ exists: boolean }[]>`
        WITH RECURSIVE ancestors AS (
            SELECT "parentFolderId", "isDeleted"
            FROM "Folder"
            WHERE "id" = ${folderId}

            UNION ALL

            SELECT f."parentFolderId", f."isDeleted"
            FROM "Folder" f
            INNER JOIN ancestors a
                ON f."id" = a."parentFolderId"
        )
        SELECT EXISTS (
            SELECT 1
            FROM ancestors
            WHERE "isDeleted" = true
        ) AS "exists"
    `;

        return result[0].exists;
    }

    async deleteFolder(userId: string, folderId: string): Promise<FolderResponseDTO> {
        await this.checkFolderPermission(
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
            include: {
                drive: {
                    include: {
                        user: {
                            select: { id: true, fullName: true },
                        },
                    },
                },
            },
        });

        return {
            id: folder.id,
            folderName: folder.folderName,
            parentFolderId: folder.parentFolderId,
            driveId: folder.driveId,
            status: folder.status,
            createdAt: folder.createdAt,
            updatedAt: folder.updatedAt,
            owner: {
                id: folder.drive.user.id,
                fullName: folder.drive.user.fullName
            },
        };
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
            include: {
                drive: {
                    include: {
                        user: {
                            select: { id: true, fullName: true },
                        },
                    },
                },
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
                fullName: folder.drive.user.fullName
            },
        }));
    }
}