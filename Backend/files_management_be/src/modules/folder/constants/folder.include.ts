import { Prisma } from "@prisma/client";

export const folderWithOwnerInclude = {
    drive: {
        include: {
            user: {
                select: {
                    id: true,
                    fullName: true,
                },
            },
        },
    },
} satisfies Prisma.FolderInclude;