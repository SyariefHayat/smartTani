-- CreateTable
CREATE TABLE "proposals" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "farmer_id" UUID NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "commodity" VARCHAR(100) NOT NULL,
    "land_area_ha" DOUBLE PRECISION NOT NULL,
    "location" JSONB NOT NULL,
    "funding_needed" DECIMAL(15,2) NOT NULL,
    "funding_raised" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "projected_roi_percent" DOUBLE PRECISION NOT NULL,
    "duration_days" INTEGER NOT NULL,
    "harvest_date_estimated" TIMESTAMPTZ NOT NULL,
    "description" TEXT NOT NULL,
    "use_of_funds" TEXT NOT NULL,
    "risk_notes" TEXT NOT NULL,
    "supporting_docs" TEXT[],
    "status" VARCHAR(50) NOT NULL DEFAULT 'pending',
    "admin_notes" TEXT,
    "approved_at" TIMESTAMPTZ,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "proposals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "investments" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "investor_id" UUID NOT NULL,
    "proposal_id" UUID NOT NULL,
    "amount" DECIMAL(15,2) NOT NULL,
    "platform_fee_percent" DOUBLE PRECISION NOT NULL,
    "projected_return" DECIMAL(15,2) NOT NULL,
    "actual_return" DECIMAL(15,2),
    "status" VARCHAR(50) NOT NULL DEFAULT 'paid',
    "invested_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completed_at" TIMESTAMPTZ,

    CONSTRAINT "investments_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "investments" ADD CONSTRAINT "investments_proposal_id_fkey" FOREIGN KEY ("proposal_id") REFERENCES "proposals"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
