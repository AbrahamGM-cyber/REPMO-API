/*
  Warnings:

  - Made the column `store_id` on table `SparePart` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "SparePart" DROP CONSTRAINT "SparePart_store_id_fkey";

-- AlterTable
ALTER TABLE "SparePart" ALTER COLUMN "store_id" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "SparePart" ADD CONSTRAINT "SparePart_store_id_fkey" FOREIGN KEY ("store_id") REFERENCES "Store"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
