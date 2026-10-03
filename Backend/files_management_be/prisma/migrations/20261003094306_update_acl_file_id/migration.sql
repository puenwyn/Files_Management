/*
  Warnings:

  - A unique constraint covering the columns `[userId,fileId]` on the table `ACL` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "ACL" ADD COLUMN     "fileId" TEXT,
ALTER COLUMN "folderId" DROP NOT NULL;

-- CreateIndex
CREATE INDEX "ACL_fileId_idx" ON "ACL"("fileId");

-- CreateIndex
CREATE UNIQUE INDEX "ACL_userId_fileId_key" ON "ACL"("userId", "fileId");

-- AddForeignKey
ALTER TABLE "ACL" ADD CONSTRAINT "ACL_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "File"("id") ON DELETE CASCADE ON UPDATE CASCADE;
