-- AlterTable
ALTER TABLE "users" ADD COLUMN     "commodities" JSONB DEFAULT '[]',
ADD COLUMN     "farm_address" TEXT,
ADD COLUMN     "farm_description" TEXT,
ADD COLUMN     "farm_name" VARCHAR(255),
ADD COLUMN     "farm_size_ha" DOUBLE PRECISION;
