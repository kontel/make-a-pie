/*
  Warnings:

  - You are about to drop the column `imageUrl` on the `Pie` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Pie" DROP COLUMN "imageUrl",
ADD COLUMN     "imageData" TEXT;
