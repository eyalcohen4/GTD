/*
  Warnings:

  - You are about to drop the column `category` on the `Task` table. All the data in the column will be lost.
  - Added the required column `status` to the `Task` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "StatusEnum" AS ENUM ('INBOX', 'NEXT_ACTION', 'WAITING_FOR', 'SOMEDAY_MAYBE', 'CALENDAR', 'REFERENCE', 'REVIEW', 'ARCHIVE');

-- AlterTable
ALTER TABLE "Task" DROP COLUMN "category",
ADD COLUMN     "status" "StatusEnum" NOT NULL;

-- DropEnum
DROP TYPE "CategoryEnum";
