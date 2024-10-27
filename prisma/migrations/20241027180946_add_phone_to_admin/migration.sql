/*
  Warnings:

  - Added the required column `phone` to the `admins` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "admins" ADD COLUMN     "phone" TEXT NOT NULL;
