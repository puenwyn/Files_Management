import { BadRequestException, ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { FolderService } from "../folder/folder.service";
import { PermissionType } from "@prisma/client";

@Injectable()
export class ACLService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly folderService: FolderService
    ) { }

    async sharedFolder(
        folderId: string,
        userId: string,
        targetUserId: string,
        permission: PermissionType
    ) {
        await this.folderService.checkFolderPermission(folderId, userId, PermissionType.SHARE);
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