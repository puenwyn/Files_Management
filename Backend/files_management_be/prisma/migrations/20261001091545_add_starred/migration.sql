-- CreateEnum
CREATE TYPE "FileStatus" AS ENUM ('READ_ONLY', 'HIDDEN', 'MODIFY');

-- CreateEnum
CREATE TYPE "ScanStatus" AS ENUM ('PENDING', 'SCANNING', 'THREAT', 'VALID');

-- CreateTable
CREATE TABLE "Starred" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "resourceId" TEXT NOT NULL,
    "resourceType" "ResourceType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Starred_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Starred_userId_idx" ON "Starred"("userId");

-- CreateIndex
CREATE INDEX "Starred_resourceId_resourceType_idx" ON "Starred"("resourceId", "resourceType");

-- CreateIndex
CREATE UNIQUE INDEX "Starred_userId_resourceId_resourceType_key" ON "Starred"("userId", "resourceId", "resourceType");

-- AddForeignKey
ALTER TABLE "Starred" ADD CONSTRAINT "Starred_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
