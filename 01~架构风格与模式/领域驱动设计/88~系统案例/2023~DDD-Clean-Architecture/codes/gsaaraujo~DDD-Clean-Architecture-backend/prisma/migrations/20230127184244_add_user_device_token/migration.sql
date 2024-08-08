-- CreateTable
CREATE TABLE "UserDeviceToken" (
    "id" VARCHAR(36) NOT NULL,
    "token" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "UserDeviceToken_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserDeviceToken_token_key" ON "UserDeviceToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "UserDeviceToken_userId_key" ON "UserDeviceToken"("userId");

-- AddForeignKey
ALTER TABLE "UserDeviceToken" ADD CONSTRAINT "UserDeviceToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
