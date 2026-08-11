/*
  Warnings:

  - You are about to drop the column `canShare` on the `ACL` table. All the data in the column will be lost.

*/
-- AlterEnum
ALTER TYPE "PermissionType" ADD VALUE 'SHARE';

-- AlterTable
ALTER TABLE "ACL" DROP COLUMN "canShare";
