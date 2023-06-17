/*
  Warnings:

  - Added the required column `progress` to the `Goal` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `Goal` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "GoalStatus" AS ENUM ('NOT_STARTED', 'IN_PROGRESS', 'ON_HOLD', 'COMPLETED');

-- AlterTable
ALTER TABLE "Goal" ADD COLUMN     "dueDate" TIMESTAMP(3),
ADD COLUMN     "motivation" TEXT,
ADD COLUMN     "progress" INTEGER NOT NULL,
ADD COLUMN     "status" "GoalStatus" NOT NULL;

-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "goalId" TEXT;

-- AlterTable
ALTER TABLE "Task" ADD COLUMN     "goalId" TEXT;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_goalId_fkey" FOREIGN KEY ("goalId") REFERENCES "Goal"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_goalId_fkey" FOREIGN KEY ("goalId") REFERENCES "Goal"("id") ON DELETE SET NULL ON UPDATE CASCADE;
