import { Injectable } from "@nestjs/common";
import { PasswordResetToken, Prisma } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class PasswordResetTokenService {
    constructor(private readonly prisma: PrismaService) { }

    async create(data: Prisma.PasswordResetTokenCreateInput): Promise<PasswordResetToken> {
        return this.prisma.passwordResetToken.create({
            data
        })
    }

    async findByUserId(userId: string) {
        return this.prisma.passwordResetToken.findFirst({
            where: {
                userId,
                used: false,
            },
            orderBy: {
                createdAt: "desc",
            },
        });
    }

    async markAsUsed(id: string) {
        return this.prisma.passwordResetToken.update({
            where: {
                id,
            },
            data: {
                used: true,
            },
        });
    }

    async deleteByUserId(userId: string) {
        return this.prisma.passwordResetToken.deleteMany({
            where: {
                userId,
            },
        });
    }
}