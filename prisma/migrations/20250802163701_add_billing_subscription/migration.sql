-- CreateTable
CREATE TABLE "BillingSubscription" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "shop" TEXT NOT NULL,
    "subscriptionId" TEXT,
    "planName" TEXT NOT NULL DEFAULT 'FREE',
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "trialStartsAt" DATETIME,
    "trialEndsAt" DATETIME,
    "billingOn" DATETIME,
    "test" BOOLEAN NOT NULL DEFAULT false
);

-- CreateIndex
CREATE UNIQUE INDEX "BillingSubscription_shop_key" ON "BillingSubscription"("shop");
