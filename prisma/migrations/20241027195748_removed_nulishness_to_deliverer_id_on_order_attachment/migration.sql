/*
  Warnings:

  - Made the column `deliverer_id` on table `order_attachments` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "order_attachments" DROP CONSTRAINT "order_attachments_deliverer_id_fkey";

-- AlterTable
ALTER TABLE "order_attachments" ALTER COLUMN "deliverer_id" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "order_attachments" ADD CONSTRAINT "order_attachments_deliverer_id_fkey" FOREIGN KEY ("deliverer_id") REFERENCES "deliverers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
