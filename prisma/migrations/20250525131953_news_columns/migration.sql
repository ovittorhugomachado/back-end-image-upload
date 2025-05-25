/*
  Warnings:

  - You are about to drop the column `image` on the `usuário` table. All the data in the column will be lost.
  - Added the required column `key` to the `usuário` table without a default value. This is not possible if the table is not empty.
  - Added the required column `size` to the `usuário` table without a default value. This is not possible if the table is not empty.
  - Added the required column `url` to the `usuário` table without a default value. This is not possible if the table is not empty.
  - Made the column `name` on table `usuário` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "usuário" DROP COLUMN "image",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "key" VARCHAR(255) NOT NULL,
ADD COLUMN     "size" INTEGER NOT NULL,
ADD COLUMN     "url" VARCHAR(255) NOT NULL,
ALTER COLUMN "name" SET NOT NULL,
ALTER COLUMN "name" SET DATA TYPE VARCHAR(255);
