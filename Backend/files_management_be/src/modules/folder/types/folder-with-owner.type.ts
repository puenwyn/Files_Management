import { Prisma } from "@prisma/client";
import { folderWithOwnerInclude } from "../constants/folder.include";

export type FolderWithOwner = Prisma.FolderGetPayload<{
    include: typeof folderWithOwnerInclude;
}>;