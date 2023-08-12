-- DropForeignKey
ALTER TABLE "TaskColumn" DROP CONSTRAINT "TaskColumn_columnId_fkey";

-- AddForeignKey
ALTER TABLE "TaskColumn" ADD CONSTRAINT "TaskColumn_columnId_fkey" FOREIGN KEY ("columnId") REFERENCES "Column"("id") ON DELETE CASCADE ON UPDATE CASCADE;
