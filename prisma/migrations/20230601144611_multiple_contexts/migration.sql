/*
  Warnings:

  - You are about to drop the column `contextId` on the `Task` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Task" DROP CONSTRAINT "Task_contextId_fkey";

-- AlterTable
ALTER TABLE "Task" DROP COLUMN "contextId";

-- CreateTable
CREATE TABLE "_ContextToTask" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ContextToTask_AB_unique" ON "_ContextToTask"("A", "B");

-- CreateIndex
CREATE INDEX "_ContextToTask_B_index" ON "_ContextToTask"("B");

-- AddForeignKey
ALTER TABLE "_ContextToTask" ADD CONSTRAINT "_ContextToTask_A_fkey" FOREIGN KEY ("A") REFERENCES "Context"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ContextToTask" ADD CONSTRAINT "_ContextToTask_B_fkey" FOREIGN KEY ("B") REFERENCES "Task"("id") ON DELETE CASCADE ON UPDATE CASCADE;
