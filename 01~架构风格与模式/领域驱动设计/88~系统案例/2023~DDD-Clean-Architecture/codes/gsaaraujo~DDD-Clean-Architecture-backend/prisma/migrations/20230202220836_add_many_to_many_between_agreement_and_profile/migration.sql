/*
  Warnings:

  - You are about to drop the `Agreement` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Notification` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Profile` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserDeviceToken` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Agreement" DROP CONSTRAINT "Agreement_creditorPartyId_fkey";

-- DropForeignKey
ALTER TABLE "Agreement" DROP CONSTRAINT "Agreement_debtorPartyId_fkey";

-- DropForeignKey
ALTER TABLE "Notification" DROP CONSTRAINT "Notification_recipientPartyId_fkey";

-- DropForeignKey
ALTER TABLE "Profile" DROP CONSTRAINT "Profile_userId_fkey";

-- DropForeignKey
ALTER TABLE "UserDeviceToken" DROP CONSTRAINT "UserDeviceToken_userId_fkey";

-- DropTable
DROP TABLE "Agreement";

-- DropTable
DROP TABLE "Notification";

-- DropTable
DROP TABLE "Profile";

-- DropTable
DROP TABLE "User";

-- DropTable
DROP TABLE "UserDeviceToken";

-- CreateTable
CREATE TABLE "users" (
    "id" VARCHAR(36) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_device_tokens" (
    "id" VARCHAR(36) NOT NULL,
    "token" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "user_device_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "profiles" (
    "id" VARCHAR(36) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "image_url" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "agreements" (
    "id" VARCHAR(36) NOT NULL,
    "made_at" TIMESTAMP(3) NOT NULL,
    "amount" INTEGER NOT NULL,
    "is_currency" BOOLEAN NOT NULL,
    "description" VARCHAR(255),
    "debtor_status" "PartyStatus" NOT NULL,
    "creditor_status" "PartyStatus" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "agreements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "agreements_profiles" (
    "debtor_profile_id" TEXT NOT NULL,
    "creditor_profile_id" TEXT NOT NULL,
    "agreement_id" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" VARCHAR(36) NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "content" VARCHAR(255) NOT NULL,
    "sent_at" TIMESTAMP(3) NOT NULL,
    "read_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "recipientProfileId" TEXT NOT NULL,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "user_device_tokens_token_key" ON "user_device_tokens"("token");

-- CreateIndex
CREATE UNIQUE INDEX "user_device_tokens_user_id_key" ON "user_device_tokens"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "profiles_user_id_key" ON "profiles"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "agreements_profiles_debtor_profile_id_key" ON "agreements_profiles"("debtor_profile_id");

-- CreateIndex
CREATE UNIQUE INDEX "agreements_profiles_creditor_profile_id_key" ON "agreements_profiles"("creditor_profile_id");

-- CreateIndex
CREATE UNIQUE INDEX "agreements_profiles_agreement_id_key" ON "agreements_profiles"("agreement_id");

-- CreateIndex
CREATE UNIQUE INDEX "notifications_recipientProfileId_key" ON "notifications"("recipientProfileId");

-- AddForeignKey
ALTER TABLE "user_device_tokens" ADD CONSTRAINT "user_device_tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "agreements_profiles" ADD CONSTRAINT "agreements_profiles_debtor_profile_id_fkey" FOREIGN KEY ("debtor_profile_id") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "agreements_profiles" ADD CONSTRAINT "agreements_profiles_creditor_profile_id_fkey" FOREIGN KEY ("creditor_profile_id") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "agreements_profiles" ADD CONSTRAINT "agreements_profiles_agreement_id_fkey" FOREIGN KEY ("agreement_id") REFERENCES "agreements"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_recipientProfileId_fkey" FOREIGN KEY ("recipientProfileId") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
