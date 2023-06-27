-- AlterTable
ALTER TABLE "Kpi" ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "KpiEntry" ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "KpiTarget" ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false;
