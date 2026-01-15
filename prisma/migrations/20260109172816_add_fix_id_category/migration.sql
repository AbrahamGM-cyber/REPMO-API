/*
  Warnings:

  - Added the required column `category_id` to the `SparePart` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "SparePart" ADD COLUMN     "category_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "SparePart" ADD CONSTRAINT "SparePart_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
