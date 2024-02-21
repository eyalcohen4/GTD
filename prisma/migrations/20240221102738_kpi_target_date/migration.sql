/*
  Warnings:

  - You are about to drop the column `updatedAt` on the `KpiTarget` table. All the data in the column will be lost.
  - You are about to drop the `Experiment` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Experiment" DROP CONSTRAINT "Experiment_kpiId_fkey";

-- DropForeignKey
ALTER TABLE "Experiment" DROP CONSTRAINT "Experiment_projectId_fkey";

-- DropForeignKey
ALTER TABLE "Experiment" DROP CONSTRAINT "Experiment_userId_fkey";

-- AlterTable
ALTER TABLE "Kpi" ADD COLUMN     "goalId" TEXT;

-- AlterTable
ALTER TABLE "KpiTarget" DROP COLUMN "updatedAt",
ALTER COLUMN "targetDate" DROP NOT NULL;

-- DropTable
DROP TABLE "Experiment";

-- AddForeignKey
ALTER TABLE "Kpi" ADD CONSTRAINT "Kpi_goalId_fkey" FOREIGN KEY ("goalId") REFERENCES "Goal"("id") ON DELETE SET NULL ON UPDATE CASCADE;
