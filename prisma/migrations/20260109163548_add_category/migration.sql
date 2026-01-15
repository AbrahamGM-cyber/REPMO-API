-- CreateTable
CREATE TABLE "Category" (
    "code" TEXT NOT NULL,
    "id" TEXT NOT NULL,
    "name_category" TEXT NOT NULL,
    "category_count" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("code")
);
