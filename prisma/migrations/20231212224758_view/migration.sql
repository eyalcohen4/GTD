-- CreateEnum
CREATE TYPE "ViewType" AS ENUM ('TASK', 'PROJECT');

-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "viewsId" TEXT;

-- CreateTable
CREATE TABLE "View" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "filter" JSONB NOT NULL,
    "type" "ViewType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "View_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "View" ADD CONSTRAINT "View_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
