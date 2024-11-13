/*
  Warnings:

  - You are about to drop the column `cpf` on the `admins` table. All the data in the column will be lost.
  - You are about to drop the column `cpf` on the `deliverers` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "admins_cpf_key";

-- DropIndex
DROP INDEX "deliverers_cpf_key";

-- AlterTable
ALTER TABLE "admins" DROP COLUMN "cpf";

-- AlterTable
ALTER TABLE "deliverers" DROP COLUMN "cpf";
