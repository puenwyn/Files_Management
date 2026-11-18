-- AlterTable
ALTER TABLE "Activity" ADD COLUMN     "fileId" TEXT;

-- CreateIndex
CREATE INDEX "Activity_fileId_idx" ON "Activity"("fileId");

-- AddForeignKey
ALTER TABLE "Activity" ADD CONSTRAINT "Activity_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "File"("id") ON DELETE SET NULL ON UPDATE CASCADE;
