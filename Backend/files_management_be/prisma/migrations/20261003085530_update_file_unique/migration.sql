/*
  Warnings:

  - A unique constraint covering the columns `[driveId,folderId,name,extension]` on the table `File` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "File_name_key";

-- CreateIndex
CREATE UNIQUE INDEX "File_driveId_folderId_name_extension_key" ON "File"("driveId", "folderId", "name", "extension");
