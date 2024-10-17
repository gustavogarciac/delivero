/*
  Warnings:

  - You are about to drop the column `picket_at` on the `Order` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Order" DROP COLUMN "picket_at",
ADD COLUMN     "picked_at" TIMESTAMP(3);
