-- CreateTable
CREATE TABLE "Drive" (
    "id" TEXT NOT NULL,
    "driveName" VARCHAR(255) NOT NULL,
    "totalSpace" BIGINT NOT NULL,
    "usedSpace" BIGINT NOT NULL,
    "usedPercent" DOUBLE PRECISION NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Drive_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Drive_userId_idx" ON "Drive"("userId");

-- AddForeignKey
ALTER TABLE "Drive" ADD CONSTRAINT "Drive_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
