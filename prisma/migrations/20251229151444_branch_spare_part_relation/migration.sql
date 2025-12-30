/*
  Warnings:

  - You are about to drop the column `store_id` on the `SparePart` table. All the data in the column will be lost.
  - Added the required column `branch_id` to the `SparePart` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "SparePart" DROP CONSTRAINT "SparePart_store_id_fkey";

-- AlterTable
ALTER TABLE "SparePart" DROP COLUMN "store_id",
ADD COLUMN     "branch_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "SparePart" ADD CONSTRAINT "SparePart_branch_id_fkey" FOREIGN KEY ("branch_id") REFERENCES "Branch"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
