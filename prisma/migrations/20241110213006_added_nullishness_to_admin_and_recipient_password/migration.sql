-- AlterTable
ALTER TABLE "admins" ALTER COLUMN "password" DROP NOT NULL;

-- AlterTable
ALTER TABLE "recipients" ALTER COLUMN "password" DROP NOT NULL;
