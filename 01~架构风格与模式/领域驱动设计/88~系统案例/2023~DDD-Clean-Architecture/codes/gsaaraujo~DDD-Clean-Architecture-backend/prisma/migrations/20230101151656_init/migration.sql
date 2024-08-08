-- CreateEnum
CREATE TYPE "PartyStatus" AS ENUM ('PENDING', 'ACCEPTED', 'DENIED', 'CANCELED', 'PAID');

-- CreateTable
CREATE TABLE "User" (
    "id" VARCHAR(36) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Profile" (
    "id" VARCHAR(36) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "imageUrl" VARCHAR(255),
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Agreement" (
    "id" VARCHAR(36) NOT NULL,
    "madeAt" TIMESTAMP(3) NOT NULL,
    "amount" INTEGER NOT NULL,
    "isCurrency" BOOLEAN NOT NULL,
    "description" VARCHAR(255),
    "debtorStatus" "PartyStatus" NOT NULL,
    "creditorStatus" "PartyStatus" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "debtorPartyId" TEXT NOT NULL,
    "creditorPartyId" TEXT NOT NULL,

    CONSTRAINT "Agreement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" VARCHAR(36) NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "content" VARCHAR(255) NOT NULL,
    "sentAt" TIMESTAMP(3) NOT NULL,
    "readAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "recipientPartyId" TEXT NOT NULL,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_password_key" ON "User"("password");

-- CreateIndex
CREATE UNIQUE INDEX "Profile_userId_key" ON "Profile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Agreement_debtorPartyId_key" ON "Agreement"("debtorPartyId");

-- CreateIndex
CREATE UNIQUE INDEX "Agreement_creditorPartyId_key" ON "Agreement"("creditorPartyId");

-- CreateIndex
CREATE UNIQUE INDEX "Notification_recipientPartyId_key" ON "Notification"("recipientPartyId");

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Agreement" ADD CONSTRAINT "Agreement_debtorPartyId_fkey" FOREIGN KEY ("debtorPartyId") REFERENCES "Profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Agreement" ADD CONSTRAINT "Agreement_creditorPartyId_fkey" FOREIGN KEY ("creditorPartyId") REFERENCES "Profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_recipientPartyId_fkey" FOREIGN KEY ("recipientPartyId") REFERENCES "Profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
