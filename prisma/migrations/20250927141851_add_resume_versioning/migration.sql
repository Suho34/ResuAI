-- AlterTable
ALTER TABLE "public"."resumes" ADD COLUMN     "isCurrent" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "parent_id" TEXT,
ADD COLUMN     "versionNumber" INTEGER NOT NULL DEFAULT 1;
