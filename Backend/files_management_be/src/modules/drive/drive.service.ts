import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { Drive, Prisma } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";
import { DriveResponseDTO } from "./dtos/drive-response.dto";
import { StorageResponseDTO } from "./dtos/storage-response.dto";

@Injectable()
export class DriveService {
    constructor(private readonly prisma: PrismaService) { }

    async getDrives(userId: string): Promise<DriveResponseDTO[]> {
        const drives = await this.prisma.drive.findMany({
            where: {
                userId,
                isDeleted: false
            },
            orderBy: {
                driveName: "asc"
            },
        });
        return drives.map((drive) => ({
            id: drive.id,
            driveName: drive.driveName,
            totalSpace: drive.totalSpace.toString(),
            usedSpace: drive.usedSpace.toString(),
            usedPercent: drive.usedPercent,
            primary: drive.primary ?? false,
            createdAt: drive.createdAt,
            updatedAt: drive.updatedAt
        }));
    }

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

    async findDriveById(driveId: string, userId: string): Promise<DriveResponseDTO> {
        const drive = await this.prisma.drive.findUnique({
            where: {
                id: driveId,
                userId,
                isDeleted: false
            },
        });

        if (!drive) throw new NotFoundException("Drive not found");

        return {
            id: drive.id,
            driveName: drive.driveName,
            totalSpace: drive.totalSpace.toString(),
            usedSpace: drive.usedSpace.toString(),
            usedPercent: drive.usedPercent,
            primary: drive.primary ?? false,
            createdAt: drive.createdAt,
            updatedAt: drive.updatedAt
        };
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

    async getTotalStorage(userId: string): Promise<StorageResponseDTO> {
        const result = await this.prisma.drive.aggregate({
            where: { userId, isDeleted: false },
            _sum: {
                totalSpace: true,
                usedSpace: true
            },
        });
        const totalSpace = Number(result._sum.totalSpace);
        const usedSpace = Number(result._sum.usedSpace);

        const usedPercent = totalSpace > 0 ? (usedSpace / totalSpace) * 100 : 0;

        return {
            totalSpace,
            usedSpace,
            usedPercent
        }
    }

    async checkStorageCapacity(
        driveId: string,
        additionalSpace: bigint,
    ) {
        const drive = await this.prisma.drive.findUnique({
            where: { id: driveId },
            select: {
                totalSpace: true,
                usedSpace: true,
                isDeleted: true,
            },
        });

        if (!drive || drive.isDeleted) {
            throw new NotFoundException("Drive not found!");
        }

        if (drive.usedSpace + additionalSpace > drive.totalSpace) {
            throw new BadRequestException(
                "Not enough storage space in this Drive!",
            );
        }
    }

    async updateStorageUsage(
        tx: Prisma.TransactionClient,
        driveId: string,
        delta: bigint,
    ) {
        if (delta === 0n) return;

        const drive = await tx.drive.findUnique({
            where: { id: driveId },
            select: {
                id: true,
                totalSpace: true,
                usedSpace: true,
            },
        });

        if (!drive) {
            throw new NotFoundException("Drive not found!");
        }

        const newUsedSpace = drive.usedSpace + delta;

        if (newUsedSpace < 0n) {
            throw new Error("Invalid storage usage!");
        }

        if (newUsedSpace > drive.totalSpace) {
            throw new Error("Drive storage capacity exceeded!");
        }

        const usedPercent =
            drive.totalSpace > 0n
                ? Number(newUsedSpace) / Number(drive.totalSpace) * 100
                : 0;

        return tx.drive.update({
            where: { id: driveId },
            data: {
                usedSpace: newUsedSpace,
                usedPercent,
            },
        });
    }

}