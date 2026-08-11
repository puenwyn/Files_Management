-- CreateEnum
CREATE TYPE "FolderStatus" AS ENUM ('SHOW', 'HIDDEN');

-- CreateEnum
CREATE TYPE "PermissionType" AS ENUM ('VIEW', 'EDIT', 'SHARE');

-- CreateTable
CREATE TABLE "Folder" (
    "id" TEXT NOT NULL,
    "folderName" VARCHAR(255) NOT NULL,
    "parentFolderId" TEXT NOT NULL,
    "driveId" TEXT NOT NULL,
    "status" "FolderStatus" NOT NULL,
    "passwordHash" TEXT,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Folder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ACL" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "folderId" TEXT NOT NULL,
    "permissionType" "PermissionType" NOT NULL,
    "isOwner" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

-- CreateIndex
CREATE INDEX "Folder_parentFolderId_idx" ON "Folder"("parentFolderId");

-- CreateIndex
CREATE INDEX "Folder_driveId_idx" ON "Folder"("driveId");

-- CreateIndex
CREATE INDEX "ACL_folderId_idx" ON "ACL"("folderId");

-- CreateIndex
CREATE UNIQUE INDEX "ACL_userId_folderId_key" ON "ACL"("userId", "folderId");

-- AddForeignKey
ALTER TABLE "Folder" ADD CONSTRAINT "Folder_driveId_fkey" FOREIGN KEY ("driveId") REFERENCES "Drive"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Folder" ADD CONSTRAINT "Folder_parentFolderId_fkey" FOREIGN KEY ("parentFolderId") REFERENCES "Folder"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ACL" ADD CONSTRAINT "ACL_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ACL" ADD CONSTRAINT "ACL_folderId_fkey" FOREIGN KEY ("folderId") REFERENCES "Folder"("id") ON DELETE CASCADE ON UPDATE CASCADE;
