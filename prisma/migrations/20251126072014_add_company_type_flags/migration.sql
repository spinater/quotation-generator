-- AlterTable
ALTER TABLE "companies" ADD COLUMN     "isCustomer" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isIssuer" BOOLEAN NOT NULL DEFAULT true;
