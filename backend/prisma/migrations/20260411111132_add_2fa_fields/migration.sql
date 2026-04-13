-- AlterTable
ALTER TABLE "User" ADD COLUMN     "otp_enable" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "otp_secret" VARCHAR(40);
