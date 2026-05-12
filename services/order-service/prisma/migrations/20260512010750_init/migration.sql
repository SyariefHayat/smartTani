-- CreateTable
CREATE TABLE "orders" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "buyer_id" UUID NOT NULL,
    "total_amount" DECIMAL(15,2) NOT NULL,
    "platform_fee" DECIMAL(15,2) NOT NULL,
    "shipping_cost" DECIMAL(15,2) DEFAULT 0,
    "status" VARCHAR(50) NOT NULL DEFAULT 'pending_payment',
    "payment_method" VARCHAR(100),
    "payment_url" TEXT,
    "shipping_address" JSONB,
    "notes" TEXT,
    "paid_at" TIMESTAMPTZ,
    "completed_at" TIMESTAMPTZ,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order_items" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "order_id" UUID NOT NULL,
    "product_id" UUID NOT NULL,
    "farmer_id" UUID NOT NULL,
    "quantity" DECIMAL(10,2) NOT NULL,
    "price_per_unit" DECIMAL(15,2) NOT NULL,
    "subtotal" DECIMAL(15,2) NOT NULL,

    CONSTRAINT "order_items_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;
