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

    async renameFolder(userId: string, folderId: string, newFolderName: string) {
        await this.checkFolderPermission(folderId, userId, PermissionType.EDIT);
        return this.prisma.folder.update({
            where: {
                id: folderId
            },
            data: {
                folderName: newFolderName
            }
        });
    }

    async getDriveFolders(userId: string, driveId: string): Promise<FolderResponseDTO[]> {
        await this.checkDrive(driveId, userId);
        const folders = await this.prisma.folder.findMany({
            where: {
                parentFolderId: null,
                driveId,
                isDeleted: false
            },
            orderBy: {
                folderName: "asc"
            }
        });
        return folders.map((folder) => ({
            id: folder.id,
            folderName: folder.folderName,
            parentFolderId: folder.parentFolderId,
            status: folder.status,
            createdAt: folder.createdAt,
            updatedAt: folder.updatedAt
        }));
    }

    private hasPermission(current: PermissionType, required: PermissionType): boolean {
        const permissions = {
            VIEW: 1,
            EDIT: 2,
            SHARE: 3,
        };
        return permissions[current] >= permissions[required];
    }

    async checkFolderPermission(folderId: string, userId: string, requiredPermission: PermissionType) {
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

        return acl.folder;
    }

    async getFolderChildrens(folderId: string, userId: string) {
        await this.checkFolderPermission(folderId, userId, PermissionType.VIEW);
        return this.prisma.folder.findMany({
            where: {
                parentFolderId: folderId,
                isDeleted: false
            },
            orderBy: {
                folderName: "asc"
            }
        })
    }

    async hideFolder(userId: string, folderId: string, password: string) {
        await this.checkFolderOwnership(folderId, userId);
        const passwordHash = await bcrypt.hash(password, 10,);

        return this.prisma.folder.update({
            where: {
                id: folderId,
            },
            data: {
                status: FolderStatus.HIDDEN,
                passwordHash,
            },
        });
    }

    async showFolder(userId: string, folderId: string, password: string) {
        const folder = await this.checkFolderOwnership(folderId, userId);
        if (!folder.passwordHash) throw new BadRequestException("Password is not set!");

        const isValid = await bcrypt.compare(password, folder.passwordHash);
        if (!isValid) throw new UnauthorizedException("Password is not valid!");

        return this.prisma.folder.update({
            where: {
                id: folderId,
            },
            data: {
                status: FolderStatus.SHOW,
                passwordHash: null
            },
        });
    }
}