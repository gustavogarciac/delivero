-- AlterTable
ALTER TABLE "order_attachments" ADD COLUMN     "deliverer_id" TEXT;

-- AddForeignKey
ALTER TABLE "order_attachments" ADD CONSTRAINT "order_attachments_deliverer_id_fkey" FOREIGN KEY ("deliverer_id") REFERENCES "deliverers"("id") ON DELETE SET NULL ON UPDATE CASCADE;
