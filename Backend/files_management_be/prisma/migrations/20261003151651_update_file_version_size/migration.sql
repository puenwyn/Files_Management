/*
  Warnings:

  - Added the required column `size` to the `FileVersion` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "FileVersion" ADD COLUMN     "size" BIGINT NOT NULL;
