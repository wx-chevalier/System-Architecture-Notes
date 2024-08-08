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

-- AddForeignKey
ALTER TABLE "UserDeviceToken" ADD CONSTRAINT "UserDeviceToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Agreement" ADD CONSTRAINT "Agreement_debtorPartyId_fkey" FOREIGN KEY ("debtorPartyId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Agreement" ADD CONSTRAINT "Agreement_creditorPartyId_fkey" FOREIGN KEY ("creditorPartyId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_recipientPartyId_fkey" FOREIGN KEY ("recipientPartyId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
