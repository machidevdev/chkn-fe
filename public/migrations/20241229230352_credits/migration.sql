/*
  Warnings:

  - The primary key for the `ParsedTransfer` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `hash` on the `ParsedTransfer` table. All the data in the column will be lost.
  - You are about to drop the column `hash` on the `Swap` table. All the data in the column will be lost.
  - You are about to drop the `Balance` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CloseEvent` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CreateEvent` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Transfer` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropIndex
DROP INDEX "ParsedTransfer_from_to_idx";

-- DropIndex
DROP INDEX "ParsedTransfer_timestamp_idx";

-- DropIndex
DROP INDEX "Swap_buyMint_idx";

-- DropIndex
DROP INDEX "Swap_buyMint_sellMint_idx";

-- DropIndex
DROP INDEX "Swap_maker_buyMint_idx";

-- DropIndex
DROP INDEX "Swap_maker_idx";

-- DropIndex
DROP INDEX "Swap_maker_sellMint_idx";

-- DropIndex
DROP INDEX "Swap_sellMint_idx";

-- DropIndex
DROP INDEX "Swap_timestamp_idx";

-- AlterTable
ALTER TABLE "ParsedTransfer" DROP CONSTRAINT "ParsedTransfer_pkey",
DROP COLUMN "hash",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "ParsedTransfer_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Swap" DROP COLUMN "hash";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "credits" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "creditsUsed" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "isTelegramLinked" BOOLEAN NOT NULL DEFAULT false;

-- DropTable
DROP TABLE "Balance";

-- DropTable
DROP TABLE "CloseEvent";

-- DropTable
DROP TABLE "CreateEvent";

-- DropTable
DROP TABLE "Transfer";
