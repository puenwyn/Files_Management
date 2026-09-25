import { Prisma } from "@prisma/client";

export const folderWithOwnerInclude = {
    acls: {
        where: {
            isOwner: true,
        },
        select: {
            user: {
                select: {
                    id: true,
                    fullName: true,
                },
            },
        },
    },
} satisfies Prisma.FolderInclude;