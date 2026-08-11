import { Injectable, NotFoundException } from "@nestjs/common";
import { Drive, Prisma } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class DriveService {
    constructor(private readonly prisma: PrismaService) { }

    async create(data: Prisma.DriveCreateInput) {
        return this.prisma.drive.create({
            data
        });
    }

    async checkDriveOwnership(id: string, userId: string) {
        const drive = await this.prisma.drive.findFirst({
            where: {
                id,
                userId,
                isDeleted: false
            }
        });
        if (!drive) throw new NotFoundException("Drive is not found or it's your own!");
        return drive;
    }

    async renameDrive(id: string, userId: string, newDriveName: string) {
        await this.checkDriveOwnership(id, userId);

        return this.prisma.drive.update({
            where: { id },
            data: {
                driveName: newDriveName
            },
            select: {
                id: true,
                driveName: true,
                usedPercent: true,
                isDeleted: true,
                createdAt: true,
                updatedAt: true,
            },
        });
    }

    async upgradeDrive(id: string, userId: string, space: bigint) {
        const drive = await this.checkDriveOwnership(id, userId);

        return this.prisma.drive.update({
            where: { id },
            data: {
                totalSpace: drive!.totalSpace + space
            },
            select: {
                id: true,
                driveName: true,
                usedPercent: true,
                isDeleted: true,
                createdAt: true,
                updatedAt: true,
            },
        })
    }

    async deleteDrive(id: string, userId: string) {
        await this.checkDriveOwnership(id, userId);

        return this.prisma.drive.update({
            where: { id },
            data: {
                isDeleted: true,
                deletedAt: new Date()
            }
        })
    }

}