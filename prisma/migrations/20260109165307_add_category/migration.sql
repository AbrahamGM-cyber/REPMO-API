/*
  Warnings:

  - The primary key for the `Category` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[code]` on the table `Category` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Category" DROP CONSTRAINT "Category_pkey";

-- CreateIndex
CREATE UNIQUE INDEX "Category_code_key" ON "Category"("code");
