import { Injectable } from "@nestjs/common";
import { Prisma, RefreshToken } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class RefreshTokenService {
    constructor(private readonly prisma: PrismaService) { }

    async create(data: Prisma.RefreshTokenCreateInput): Promise<RefreshToken> {
        return this.prisma.refreshToken.create({
            data,
        });
    }

    async update(id: string, data: Prisma.RefreshTokenUpdateInput) {
        return this.prisma.refreshToken.update({
            where: {
                id,
            },
            data,
        });
    }

    async findById(id: string) {
        return this.prisma.refreshToken.findUnique({
            where: {
                id
            }
        });
    }

    async findByUserId(userId: string) {
        return this.prisma.refreshToken.findMany({
            where: {
                userId,
                isRevoked: false
            },
            select: {
                id: true,
                deviceName: true,
                ipAddress: true,
                userAgent: true,
                createdAt: true,
                expiresAt: true,
                isRevoked: true,
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
    }

    async findAllByUserId(userId: string) {
        return this.prisma.refreshToken.findMany({
            where: {
                userId
            },
        });
    }

    async deleteById(id: string) {
        return this.prisma.refreshToken.delete({
            where: {
                id
            }
        });
    }

    async deleteManyByUserId(userId: string) {
        return this.prisma.refreshToken.deleteMany({
            where: {
                userId
            }
        })
    }

}