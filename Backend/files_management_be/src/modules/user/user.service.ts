import { Injectable, NotFoundException } from "@nestjs/common";
import { Prisma, User } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";
import { UpdateProfileDTO } from "./dtos/update-profile.dto";
import { ProfileResponseDTO } from "./dtos/profile-response.dto";
import { ShareableUserResponseDTO } from "./dtos/shareable-user-response.dto";

@Injectable()
export class UserService {
    constructor(private readonly prisma: PrismaService) { }

    async findByUsername(username: string) {
        return await this.prisma.user.findUnique({
            where: {
                username
            },
        });
    }

    async findByEmail(email: string) {
        return await this.prisma.user.findUnique({
            where: {
                email
            }
        })
    }

    async findById(id: string) {
        return this.prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                fullName: true,
                username: true,
                email: true,
                createdAt: true,
                updatedAt: true,
            },
        });
    }

    async create(data: Prisma.UserCreateInput): Promise<User> {
        return this.prisma.user.create({
            data
        })
    }

    async update(id: string, data: Prisma.UserUpdateInput): Promise<User> {
        return this.prisma.user.update({
            where: {
                id,
            },
            data
        })
    }

    async getProfile(userId: string) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                fullName: true,
                username: true,
                email: true,
                phoneNumber: true,
                bio: true,
                dob: true,
                gender: true,
                createdAt: true,
                updatedAt: true,
            },
        });

        if (!user) throw new NotFoundException("User is not found!");
        return user;
    }

    async updateProfile(userId: string, dto: UpdateProfileDTO): Promise<ProfileResponseDTO> {
        const userExisted = await this.prisma.user.findUnique({
            where: {
                id: userId
            },
        });
        if (!userExisted) throw new NotFoundException("User not found!");

        const user = await this.update(userId, {
            fullName: dto.fullName,
            phoneNumber: dto.phoneNumber,
            bio: dto.bio,
            dob: dto.dob ? new Date(dto.dob) : undefined,
            gender: dto.gender,
        });

        return {
            fullName: user.fullName,
            email: user.email,
            phoneNumber: user.phoneNumber,
            bio: user.bio,
            dob: user.dob,
            gender: user.gender,
            updatedAt: user.updatedAt,
        };
    }

    async findByIdWithPassword(id: string) {
        return this.prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                hashedPassword: true,
            },
        });
    }

    async findShareableUsers(
        userId: string,
        keyword: string | undefined
    ): Promise<ShareableUserResponseDTO[]> {
        const users = await this.prisma.user.findMany({
            where: {
                id: {
                    not: userId
                },
                ...(keyword?.trim() ? {
                    OR: [
                        {
                            fullName: {
                                contains: keyword.trim(),
                                mode: "insensitive",
                            },
                        },
                        {
                            email: {
                                contains: keyword.trim(),
                                mode: "insensitive",
                            },
                        },
                    ],
                } : {}),
            },
            select: {
                id: true,
                fullName: true,
                email: true
            },
            take: 5
        });
        return users;
    }
}