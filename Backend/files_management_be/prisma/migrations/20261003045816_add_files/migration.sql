-- CreateTable
CREATE TABLE "File" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "extension" VARCHAR(10) NOT NULL,
    "driveId" TEXT,
    "folderId" TEXT,
    "status" "FileStatus" NOT NULL DEFAULT 'MODIFY',
    "size" BIGINT NOT NULL,
    "latestVersionId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "accessedAt" TIMESTAMP(3),

    CONSTRAINT "File_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FileVersion" (
    "id" TEXT NOT NULL,
    "fileId" TEXT NOT NULL,
    "blobId" TEXT NOT NULL,
    "versionNumber" INTEGER NOT NULL,
    "mimeType" VARCHAR(100) NOT NULL,
    "encrypt" BOOLEAN NOT NULL DEFAULT false,
    "scanStatus" "ScanStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FileVersion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PhysicalBlob" (
    "id" TEXT NOT NULL,
    "relPath" VARCHAR(500) NOT NULL,
    "sha256" VARCHAR(100) NOT NULL,
    "refCount" INTEGER NOT NULL DEFAULT 0,
    "sizeBytes" BIGINT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PhysicalBlob_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "File_name_key" ON "File"("name");

-- CreateIndex
CREATE UNIQUE INDEX "File_latestVersionId_key" ON "File"("latestVersionId");

-- CreateIndex
CREATE INDEX "File_driveId_idx" ON "File"("driveId");

-- CreateIndex
CREATE INDEX "File_folderId_idx" ON "File"("folderId");

-- CreateIndex
CREATE INDEX "File_latestVersionId_idx" ON "File"("latestVersionId");

-- CreateIndex
CREATE INDEX "FileVersion_fileId_idx" ON "FileVersion"("fileId");

-- CreateIndex
CREATE INDEX "FileVersion_blobId_idx" ON "FileVersion"("blobId");

-- CreateIndex
CREATE UNIQUE INDEX "FileVersion_fileId_versionNumber_key" ON "FileVersion"("fileId", "versionNumber");

-- CreateIndex
CREATE UNIQUE INDEX "PhysicalBlob_sha256_key" ON "PhysicalBlob"("sha256");

-- CreateIndex
CREATE INDEX "PhysicalBlob_sha256_idx" ON "PhysicalBlob"("sha256");

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_driveId_fkey" FOREIGN KEY ("driveId") REFERENCES "Drive"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_folderId_fkey" FOREIGN KEY ("folderId") REFERENCES "Folder"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_latestVersionId_fkey" FOREIGN KEY ("latestVersionId") REFERENCES "FileVersion"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FileVersion" ADD CONSTRAINT "FileVersion_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "File"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FileVersion" ADD CONSTRAINT "FileVersion_blobId_fkey" FOREIGN KEY ("blobId") REFERENCES "PhysicalBlob"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
