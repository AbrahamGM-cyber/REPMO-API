/*
  Warnings:

  - Made the column `store_id` on table `Branch` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Branch" DROP CONSTRAINT "Branch_store_id_fkey";

-- AlterTable
ALTER TABLE "Branch" ALTER COLUMN "store_id" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Branch" ADD CONSTRAINT "Branch_store_id_fkey" FOREIGN KEY ("store_id") REFERENCES "Store"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
