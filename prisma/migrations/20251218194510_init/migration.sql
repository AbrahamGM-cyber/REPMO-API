-- CreateTable
CREATE TABLE "SparePart" (
    "id" TEXT NOT NULL,
    "brand" TEXT NOT NULL,
    "name_part" TEXT NOT NULL,
    "price" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "stock" INTEGER NOT NULL DEFAULT 0,
    "model" TEXT NOT NULL,
    "img_url" TEXT NOT NULL,
    "store_id" TEXT,

    CONSTRAINT "SparePart_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Store" (
    "id" TEXT NOT NULL,
    "name_store" TEXT NOT NULL,
    "direction" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,

    CONSTRAINT "Store_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "SparePart" ADD CONSTRAINT "SparePart_store_id_fkey" FOREIGN KEY ("store_id") REFERENCES "Store"("id") ON DELETE SET NULL ON UPDATE CASCADE;
