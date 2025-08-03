import { billing } from "../shopify.server";
import prisma from "../db.server";

export async function getBillingSubscription(shop) {
  try {
    return await prisma.billingSubscription.findUnique({
      where: { shop }
    });
  } catch (error) {
    console.error("Error fetching billing subscription:", error);
    return null;
  }
}

export async function createOrUpdateSubscription(shop, subscriptionData) {
  try {
    return await prisma.billingSubscription.upsert({
      where: { shop },
      update: {
        subscriptionId: subscriptionData.subscriptionId,
        planName: subscriptionData.planName,
        status: subscriptionData.status,
        updatedAt: new Date(),
        trialStartsAt: subscriptionData.trialStartsAt,
        trialEndsAt: subscriptionData.trialEndsAt,
        billingOn: subscriptionData.billingOn,
        test: subscriptionData.test || false,
      },
      create: {
        shop,
        subscriptionId: subscriptionData.subscriptionId,
        planName: subscriptionData.planName || "FREE",
        status: subscriptionData.status || "ACTIVE",
        trialStartsAt: subscriptionData.trialStartsAt,
        trialEndsAt: subscriptionData.trialEndsAt,
        billingOn: subscriptionData.billingOn,
        test: subscriptionData.test || false,
      }
    });
  } catch (error) {
    console.error("Error creating/updating billing subscription:", error);
    return null;
  }
}

export async function requireBilling(session, plan = "Free Plan", isTest = true) {
  try {
    const billingCheck = await billing.require({
      session,
      plans: [plan],
      isTest,
    });

    if (billingCheck.check.hasActivePayment) {
      // Update subscription status in database
      await createOrUpdateSubscription(session.shop, {
        subscriptionId: billingCheck.check.oneTimePurchases?.[0]?.id || billingCheck.check.appSubscriptions?.[0]?.id,
        planName: plan,
        status: "ACTIVE",
        test: isTest,
      });
    }

    return billingCheck;
  } catch (error) {
    console.error("Error in billing check:", error);
    throw error;
  }
}

export async function hasActiveBilling(shop) {
  const subscription = await getBillingSubscription(shop);
  return subscription && (subscription.status === "ACTIVE" || subscription.planName === "FREE");
}

export async function requireActiveBilling(session) {
  const hasActive = await hasActiveBilling(session.shop);
  
  if (!hasActive) {
    throw new Response("Billing subscription required", { 
      status: 402,
      headers: {
        "Location": "/app/billing"
      }
    });
  }
  
  return true;
}
