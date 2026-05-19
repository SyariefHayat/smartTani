-- AlterTable
ALTER TABLE "investments" ADD COLUMN     "actual_return" DECIMAL(15,2),
ADD COLUMN     "projected_return" DECIMAL(15,2);

-- AlterTable
ALTER TABLE "order_items" ALTER COLUMN "product_id" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "proposals" ADD COLUMN     "commodity" VARCHAR(100),
ADD COLUMN     "projected_roi_percent" DECIMAL(5,2);

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "status" VARCHAR(50) NOT NULL DEFAULT 'active';

-- CreateTable
CREATE TABLE "products" (
    "id" TEXT NOT NULL,
    "farmer_id" UUID NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "image" TEXT,
    "status" VARCHAR(50) NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
