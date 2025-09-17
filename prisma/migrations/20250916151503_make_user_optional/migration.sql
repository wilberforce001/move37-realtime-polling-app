-- DropForeignKey
ALTER TABLE "public"."Vote" DROP CONSTRAINT "Vote_userId_fkey";

-- DropIndex
DROP INDEX "public"."Vote_userId_pollId_key";

-- AlterTable
ALTER TABLE "public"."Vote" ALTER COLUMN "userId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."Vote" ADD CONSTRAINT "Vote_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
