import { BadRequestException, ConflictException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { FolderService } from "../folder/folder.service";
import { PermissionType } from "@prisma/client";
import { SharedFolderResponseDTO } from "./dtos/share-folder-response.dto";

@Injectable()
export class ACLService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly folderService: FolderService
    ) { }

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

    async getSharedFolders(userId: string): Promise<SharedFolderResponseDTO[]> {
        const acls = await this.prisma.aCL.findMany({
            where: {
                userId,
                isOwner: false,
                folder: {
                    isDeleted: false,
                }
            },
            include: {
                folder: true
            }
        });
        return acls.map((acl) => ({
            id: acl.id,
            folderId: acl.folderId,
            folderName: acl.folder.folderName,
            parentFolderId: acl.folder.parentFolderId,
            driveId: acl.folder.driveId,
            permissionType: acl.permissionType,
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

        const targetUser = await this.prisma.user.findUnique({
            where: { id: targetUserId }
        });
        if (!targetUser) throw new NotFoundException("User is not found!");

        const userACL = await this.prisma.aCL.findUnique({
            where: {
                userId_folderId: {
                    userId: targetUserId,
                    folderId
                }
            }
        });
        if (!userACL) {
            return this.prisma.aCL.create({
                data: {
                    userId: targetUserId,
                    folderId,
                    permissionType: permission,
                    isOwner: false,
                },
            });
        }

        if (userACL.permissionType === permission)
            throw new ConflictException("User has already permission for this folder");

        return this.prisma.aCL.update({
            where: {
                userId_folderId: {
                    userId: targetUserId,
                    folderId,
                },
            },
            data: {
                permissionType: permission,
            },
        })
    }
}