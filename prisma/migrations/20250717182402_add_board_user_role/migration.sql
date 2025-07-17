/*
  Warnings:

  - Added the required column `updatedAt` to the `BoardUser` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "BoardUser" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "role" TEXT NOT NULL DEFAULT 'collaborator',
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
