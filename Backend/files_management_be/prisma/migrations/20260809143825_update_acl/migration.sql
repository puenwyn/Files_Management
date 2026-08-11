/*
  Warnings:

  - The values [SHARE] on the enum `PermissionType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `isOwner` on the `ACL` table. All the data in the column will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "PermissionType_new" AS ENUM ('VIEW', 'EDIT');
ALTER TABLE "ACL" ALTER COLUMN "permissionType" TYPE "PermissionType_new" USING ("permissionType"::text::"PermissionType_new");
ALTER TYPE "PermissionType" RENAME TO "PermissionType_old";
ALTER TYPE "PermissionType_new" RENAME TO "PermissionType";
DROP TYPE "public"."PermissionType_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "Folder" DROP CONSTRAINT "Folder_parentFolderId_fkey";

-- AlterTable
ALTER TABLE "ACL" DROP COLUMN "isOwner",
ADD COLUMN     "canShare" BOOLEAN NOT NULL DEFAULT false,
ADD CONSTRAINT "ACL_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Drive" ALTER COLUMN "deletedAt" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Folder" ALTER COLUMN "parentFolderId" DROP NOT NULL,
ALTER COLUMN "status" SET DEFAULT 'SHOW',
ALTER COLUMN "deletedAt" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Folder" ADD CONSTRAINT "Folder_parentFolderId_fkey" FOREIGN KEY ("parentFolderId") REFERENCES "Folder"("id") ON DELETE SET NULL ON UPDATE CASCADE;
